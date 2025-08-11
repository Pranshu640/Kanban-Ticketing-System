import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts';
import { availableThemes } from '../../themes';
import Button from './Button';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import PulseLoader from './PulseLoader';
import styles from './DemoShowcase.module.css';

interface DemoShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoShowcase: React.FC<DemoShowcaseProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, setTheme } = useTheme();
  const [currentDemo, setCurrentDemo] = useState<'components' | 'animations' | 'themes'>('components');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeDemo = async () => {
    setIsAnimating(true);
    
    for (let i = 0; i < availableThemes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTheme(availableThemes[i]);
    }
    
    setIsAnimating(false);
  };

  const demoComponents = [
    {
      name: 'Buttons',
      component: (
        <div className={styles.buttonDemo}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      )
    },
    {
      name: 'Loading States',
      component: (
        <div className={styles.loadingDemo}>
          <LoadingSpinner size="small" text="Loading..." />
          <PulseLoader size="medium" />
          <LoadingSpinner size="large" />
        </div>
      )
    },
    {
      name: 'Empty States',
      component: (
        <EmptyState
          title="Demo Empty State"
          description="This is how empty states look in the application"
          size="small"
          action={{
            label: "Try Action",
            onClick: () => console.log('Demo action clicked'),
            variant: "primary"
          }}
        />
      )
    }
  ];

  const animationDemos = [
    {
      name: 'Hover Effects',
      component: (
        <div className={styles.hoverDemo}>
          <motion.div
            className={styles.hoverCard}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Hover me!
          </motion.div>
        </div>
      )
    },
    {
      name: 'Stagger Animation',
      component: (
        <motion.div 
          className={styles.staggerDemo}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className={styles.staggerItem}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Item {item}
            </motion.div>
          ))}
        </motion.div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.showcase}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>Component Showcase</h3>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close showcase"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.navigation}>
            <Button
              variant={currentDemo === 'components' ? 'primary' : 'outline'}
              onClick={() => setCurrentDemo('components')}
              size="small"
            >
              Components
            </Button>
            <Button
              variant={currentDemo === 'animations' ? 'primary' : 'outline'}
              onClick={() => setCurrentDemo('animations')}
              size="small"
            >
              Animations
            </Button>
            <Button
              variant={currentDemo === 'themes' ? 'primary' : 'outline'}
              onClick={() => setCurrentDemo('themes')}
              size="small"
            >
              Themes
            </Button>
          </div>

          <div className={styles.content}>
            <AnimatePresence mode="wait">
              {currentDemo === 'components' && (
                <motion.div
                  key="components"
                  className={styles.demoSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {demoComponents.map((demo, index) => (
                    <motion.div
                      key={demo.name}
                      className={styles.demoItem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4 className={styles.demoTitle}>{demo.name}</h4>
                      <div className={styles.demoContent}>
                        {demo.component}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentDemo === 'animations' && (
                <motion.div
                  key="animations"
                  className={styles.demoSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {animationDemos.map((demo, index) => (
                    <motion.div
                      key={demo.name}
                      className={styles.demoItem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4 className={styles.demoTitle}>{demo.name}</h4>
                      <div className={styles.demoContent}>
                        {demo.component}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentDemo === 'themes' && (
                <motion.div
                  key="themes"
                  className={styles.demoSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.themeDemo}>
                    <div className={styles.currentTheme}>
                      <h4>Current Theme: {state.currentTheme.name}</h4>
                      <div className={styles.themePreview}>
                        <div className={styles.colorSwatch} style={{ background: state.currentTheme.colors.primary }}>
                          Primary
                        </div>
                        <div className={styles.colorSwatch} style={{ background: state.currentTheme.colors.secondary }}>
                          Secondary
                        </div>
                        <div className={styles.colorSwatch} style={{ background: state.currentTheme.colors.accent }}>
                          Accent
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.themeActions}>
                      <Button
                        variant="primary"
                        onClick={handleThemeDemo}
                        disabled={isAnimating}
                        loading={isAnimating}
                      >
                        {isAnimating ? 'Cycling Themes...' : 'Demo All Themes'}
                      </Button>
                    </div>

                    <div className={styles.themeGrid}>
                      {availableThemes.map((theme) => (
                        <motion.div
                          key={theme.id}
                          className={`${styles.themeCard} ${state.currentTheme.id === theme.id ? styles.active : ''}`}
                          onClick={() => setTheme(theme)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={styles.themeCardHeader}>
                            <h5>{theme.name}</h5>
                          </div>
                          <div className={styles.themeCardColors}>
                            <div style={{ background: theme.colors.primary }} />
                            <div style={{ background: theme.colors.secondary }} />
                            <div style={{ background: theme.colors.accent }} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoShowcase;