import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone || '' }
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await userAPI.updateProfile(data);
      updateUser(res.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-gray-800">My Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary !py-2 !px-4 text-sm">
            <FiEdit2 size={14} /> Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input {...register('name', { required: 'Name is required' })} className="input-field" id="profile-name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={user?.email} disabled className="input-field bg-cream-100 cursor-not-allowed text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Valid phone required' } })} className="input-field" id="profile-phone" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Phone', value: user?.phone || '—' },
            { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
          ].map((field) => (
            <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">{field.label}</span>
              <span className="font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
