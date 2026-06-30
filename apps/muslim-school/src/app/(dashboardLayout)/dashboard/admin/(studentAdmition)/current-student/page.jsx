'use client'
import { Input } from '@/components/UI/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const CurrentStudentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/current-students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        reset(); // clear form
      } else {
        setMessage({ type: 'error', text: result.error || 'Submission failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error or server issue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto',padding:'12px'}}>
      

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div style={{ marginBottom: '12px' }}>
          <label>Name</label>
          <Input
            {...register('name', { required: 'Name is required' })}
            type="text"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </div>

        {/* Date */}
        <div style={{ marginBottom: '12px' }}>
          <label>Date</label>
          <Input
            {...register('date', { required: 'Date is required' })}
            type="date"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.date && <p style={{ color: 'red' }}>{errors.date.message}</p>}
        </div>

        {/* Location */}
        <div style={{ marginBottom: '12px' }}>
          <label>Location</label>
          <Input
            {...register('location', { required: 'Location is required' })}
            type="text"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.location && <p style={{ color: 'red' }}>{errors.location.message}</p>}
        </div>

        {/* Subject */}
        <div style={{ marginBottom: '12px' }}>
          <label>Subject</label>
          <Input
            {...register('subject', { required: 'Subject is required' })}
            type="text"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.subject && <p style={{ color: 'red' }}>{errors.subject.message}</p>}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Class Type</label>
          <Input
            {...register('classType', { required: 'Subject is required' })}
            type="text"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.classType && <p style={{ color: 'red' }}>{errors.classType.message}</p>}
        </div>

        {/* gender */}
        <div style={{ marginBottom: '12px' }}>
          <label>Gender</label>
          <Input
            {...register('gender', { required: 'Gender is required' })}
            type="text"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.gender && <p style={{ color: 'red' }}>{errors.gender.message}</p>}
        </div>

        {/* Time */}
        <div style={{ marginBottom: '12px' }}>
          <label>Time</label>
          <Input
            {...register('time', { required: 'Time is required' })}
            type="time"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.time && <p style={{ color: 'red' }}>{errors.time.message}</p>}
        </div>



        

        {/* Label */}
        <div style={{ marginBottom: '12px' }}>
          <label>Label</label>
          <Input
            {...register('label', { required: 'Label is required' })}
            type="text"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.label && <p style={{ color: 'red' }}>{errors.label.message}</p>}
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }} className='bg-white  rounded'>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: 20, color: message.type === 'success' ? 'White' : 'red' }}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CurrentStudentForm;
