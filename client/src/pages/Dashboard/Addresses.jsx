import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin } from 'react-icons/fi';

export default function AddressesPage() {
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await userAPI.addAddress(data);
      setAddresses(res.addresses);
      setAdding(false);
      reset();
      toast.success('Address saved!');
    } catch { toast.error('Failed to save address'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await userAPI.deleteAddress(id);
      setAddresses(data.addresses);
      toast.success('Address removed');
    } catch { toast.error('Failed to delete address'); }
  };

  const STATES = ['Andhra Pradesh','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-gray-800">Saved Addresses</h2>
        <button onClick={() => setAdding(true)} className="btn-primary !py-2 !px-4 text-sm">
          <FiPlus size={16} /> Add New
        </button>
      </div>

      {addresses.length === 0 && !adding && (
        <div className="card p-10 text-center">
          <FiMapPin size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500">No saved addresses yet</p>
        </div>
      )}

      {addresses.map((addr) => (
        <div key={addr._id} className="card p-5 flex justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-800">{addr.fullName} <span className="text-sm text-gray-400 font-normal">| {addr.phone}</span></p>
            <p className="text-sm text-gray-600 mt-1">{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
            {addr.isDefault && <span className="badge badge-green text-xs mt-2">Default</span>}
          </div>
          <button onClick={() => handleDelete(addr._id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
            <FiTrash2 size={18} />
          </button>
        </div>
      ))}

      {adding && (
        <div className="card p-6">
          <h3 className="font-serif font-bold text-lg mb-4">Add New Address</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input {...register('fullName', { required: true })} className="input-field" id="addr-fullname" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input {...register('phone', { required: true })} className="input-field" id="addr-phone" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input {...register('addressLine1', { required: true })} className="input-field" placeholder="House no., Street" id="addr-line1" />
            </div>
            <div className="sm:col-span-2">
              <input {...register('addressLine2')} className="input-field" placeholder="Area, Landmark (optional)" id="addr-line2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input {...register('city', { required: true })} className="input-field" id="addr-city" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select {...register('state', { required: true })} className="input-field" id="addr-state">
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
              <input {...register('pincode', { required: true })} maxLength={6} className="input-field" id="addr-pincode" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" {...register('isDefault')} id="addr-default" className="accent-mustard-400" />
              <label htmlFor="addr-default" className="text-sm text-gray-600">Set as default address</label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Address'}</button>
              <button type="button" onClick={() => { setAdding(false); reset(); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
