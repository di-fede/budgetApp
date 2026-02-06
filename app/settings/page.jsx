'use client';
import React, { useState, useEffect } from 'react';
import { getCategories, saveCategory, deleteCategory, updateCategory } from '../../lib/storage';
import Modal from '../../components/UI/Modal';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');

  // Edit State
  const [editingCat, setEditingCat] = useState(null); // { id, name }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    saveCategory({ name: newCatName, type: newCatType });
    setCategories(getCategories());
    setNewCatName('');
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id) => {
    if (
      confirm(
        'Delete this category? Transactions will remain but lose their category label visually.'
      )
    ) {
      deleteCategory(id);
      setCategories(getCategories());
    }
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (editingCat && editingCat.name) {
      updateCategory(editingCat.id, editingCat.name);
      setCategories(getCategories());
      setIsEditModalOpen(false);
      setEditingCat(null);
    }
  };

  return (
    <div className="container">
      <header
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Settings</h1>
      </header>

      <div
        className="card"
        style={{
          padding: '1.5rem',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h3>Categories</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'var(--card-border)',
              color: 'var(--text-color)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.8rem',
            }}
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          {['income', 'expense'].map((type) => (
            <div key={type}>
              <h4
                style={{
                  textTransform: 'capitalize',
                  marginBottom: '1rem',
                  color: '#8b949e',
                  fontSize: '1.8rem',
                }}
              >
                {type}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categories
                  .filter((c) => c.type === type)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: '#0d1117',
                        borderRadius: '8px',
                        border: '1px solid var(--card-border)',
                        fontSize: '2rem',
                      }}
                    >
                      <span>{cat.name}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEdit(cat)}
                          style={{ color: '#8b949e', padding: '0.25rem', cursor: 'pointer' }}
                          title="Rename"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          style={{ color: 'var(--danger)', padding: '0.25rem', cursor: 'pointer' }}
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Category">
        <form
          onSubmit={handleAddCategory}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#8b949e' }}>Type</label>
            <select
              value={newCatType}
              onChange={(e) => setNewCatType(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                background: '#0d1117',
                color: 'white',
                border: '1px solid var(--card-border)',
              }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#8b949e' }}>Name</label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Crypto"
              required
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                background: '#0d1117',
                color: 'white',
                border: '1px solid var(--card-border)',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Save Category
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        <form
          onSubmit={handleUpdateCategory}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '1.2rem', color: '#8b949e' }}>Name</label>
            <input
              type="text"
              value={editingCat?.name || ''}
              onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
              required
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                background: '#0d1117',
                color: 'white',
                border: '1px solid var(--card-border)',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Update
          </button>
        </form>
      </Modal>
    </div>
  );
}
