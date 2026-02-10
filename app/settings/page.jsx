'use client';
import React, { useState, useEffect } from 'react';
import {
  getCategories,
  saveCategory,
  deleteCategory,
  updateCategory,
  saveCategories,
} from '../../lib/storage';
import Modal from '../../components/UI/Modal';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProtectedRoute from '../ui/protectedRoute';

function SortableCategoryItem({ category, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: isDragging ? 'var(--bg-secondary, #fafafa)' : '#fff',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    fontSize: '2rem',
    zIndex: isDragging ? 2 : 1,
    position: 'relative',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ color: '#d1d5db', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <GripVertical size={20} />
        </div>
        <span>{category.name}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            color: '#8b949e',
            padding: '0.25rem',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
          title="Rename"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            color: 'var(--danger)',
            padding: '0.25rem',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
          title="Delete Category"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');

  // Edit State
  const [editingCat, setEditingCat] = useState(null); // { id, name }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    // We need to work with the full list
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);

    // Prevent dragging between different types (Income <-> Expense)
    if (
      categories[oldIndex] &&
      categories[newIndex] &&
      categories[oldIndex].type !== categories[newIndex].type
    ) {
      return;
    }

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);
    saveCategories(newCategories);
  };

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
    <ProtectedRoute>
      <div className="container" style={{ paddingBottom: '4rem' }}>
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
            background: 'var(--button)',
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
                background: 'var(--button)',
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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div
              style={{
                display: 'grid',
                gap: '2rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              }}
            >
              {['income', 'expense'].map((type) => {
                const typeCategories = categories.filter((c) => c.type === type);
                return (
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
                    <SortableContext
                      items={typeCategories.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {typeCategories.length === 0 && (
                          <p style={{ color: '#666', fontStyle: 'italic' }}>No categories yet.</p>
                        )}
                        {typeCategories.map((cat) => (
                          <SortableCategoryItem
                            key={cat.id}
                            category={cat}
                            onEdit={openEdit}
                            onDelete={handleDeleteCategory}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
          </DndContext>
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
    </ProtectedRoute>
  );
}
