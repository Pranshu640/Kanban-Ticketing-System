import React, { useState } from 'react';
import { Button, Modal, Input, Textarea, Select, Card } from './index';
import { Priority, TicketStatus } from '../../types';

const UIDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>UI Components Demo</h1>
      
      {/* Buttons */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        </div>
      </section>

      {/* Form Components */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Form Components</h2>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Input
            label="Input Field"
            placeholder="Enter some text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText="This is helper text"
          />
          
          <Input
            label="Required Input"
            placeholder="This field is required"
            required
            error={!inputValue ? 'This field is required' : ''}
          />
          
          <Textarea
            label="Textarea"
            placeholder="Enter a longer description"
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            showCharacterCount
            maxLength={200}
          />
          
          <Select
            label="Select Option"
            placeholder="Choose an option"
            options={selectOptions}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
        </div>
      </section>

      {/* Cards */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Cards</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card
            title="Sample Ticket"
            subtitle="TICKET-001"
            priority={Priority.HIGH}
            status={TicketStatus.IN_PROGRESS}
            assignee="John Doe"
            dueDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)} // 2 days from now
            tags={['frontend', 'urgent']}
            clickable
            onClick={() => alert('Card clicked!')}
          >
            This is a sample ticket description that shows how the card component works with various props.
          </Card>
          
          <Card
            title="Overdue Ticket"
            subtitle="TICKET-002"
            priority={Priority.URGENT}
            status={TicketStatus.TODO}
            assignee="Jane Smith"
            dueDate={new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)} // 1 day ago
            tags={['backend', 'bug']}
          >
            This ticket is overdue and shows the warning styling.
          </Card>
          
          <Card
            title="Simple Card"
            actions={
              <Button size="small" variant="ghost">
                Edit
              </Button>
            }
          >
            A simple card without status or priority indicators.
          </Card>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal"
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <p>This is a sample modal with proper focus management and accessibility features.</p>
        <Input
          label="Modal Input"
          placeholder="Try tabbing through the modal"
          fullWidth
        />
      </Modal>
    </div>
  );
};

export default UIDemo;