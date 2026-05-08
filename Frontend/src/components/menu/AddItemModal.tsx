import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';


// ─── Types ────────────────────────────────────────────────────────────────────

interface Variant {
  id: string;
  name: string;
  price: string;
}

interface AddonOption {
  id: string;
  name: string;
  price: string;
}

interface AddonGroup {
  id: string;
  name: string;
  selectionType: 'single' | 'multiple';
  options: AddonOption[];
}

interface TimeSlot {
  label: string;
  active: boolean;
}

interface FormData {
  name: string;
  category: string;
  subcategory: string;
  foodType: 'veg' | 'nonveg' | 'vegan';
  basePrice: string;
  offerPrice: string;
  gst: string;
  packagingCharge: string;
  prepTime: string;
  quantity: number;
  availableToday: boolean;
  variants: Variant[];
  addonGroups: AddonGroup[];
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  allergens: string[];
  tags: string[];
  timeSlots: TimeSlot[];
  dailyLimit: string;
  lowStockAlert: string;
  autoDisable: boolean;
}

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newItem: any) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FOOD_TYPES = [
  { key: 'veg', label: '🌱 Veg' },
  { key: 'nonveg', label: '🍗 Non-Veg' },
  { key: 'vegan', label: '🥗 Vegan' },
];

const CATEGORIES = ['Mains', 'Starters', 'Snacks', 'Desserts', 'Beverages', 'Breakfast'];
const PREP_TIMES = ['10 mins', '15 mins', '20 mins', '30 mins', '45 mins'];
const ALLERGENS = ['Dairy', 'Nuts', 'Gluten', 'Soy', 'Egg', 'Shellfish'];
const SMART_TAGS = [
  { key: 'bestseller', label: '⭐ Best Seller' },
  { key: 'trending', label: '🔥 Trending' },
  { key: 'healthy', label: '🥗 Healthy' },
  { key: 'chef_special', label: '👨‍🍳 Chef Special' },
];
const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { label: 'Breakfast', active: false },
  { label: 'Lunch', active: true },
  { label: 'Evening Snacks', active: false },
  { label: 'Dinner', active: true },
];

const INITIAL_FORM: FormData = {
  name: '', category: 'Mains', subcategory: '', foodType: 'veg',
  basePrice: '', offerPrice: '', gst: '5', packagingCharge: '',
  prepTime: '20 mins', quantity: 50, availableToday: true,
  variants: [], addonGroups: [],
  description: '', calories: '', protein: '', carbs: '', fat: '',
  allergens: [], tags: [],
  timeSlots: DEFAULT_TIME_SLOTS,
  dailyLimit: '100', lowStockAlert: '10', autoDisable: true,
};

const uid = () => Math.random().toString(36).substr(2, 9);

// ─── Accordion ────────────────────────────────────────────────────────────────

const Accordion: React.FC<{
  title: string;
  iconName: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, iconName, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={acc.card}>
      <TouchableOpacity
        style={acc.header}
        onPress={() => setOpen(p => !p)}
        activeOpacity={0.75}
      >
        <View style={acc.headerLeft}>
          <View style={acc.iconWrap}>
            <MaterialIcons name={iconName as any} size={16} color={COLORS.primary} />
          </View>
          <Text style={acc.title}>{title}</Text>
        </View>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={22}
          color="#94A3B8"
        />
      </TouchableOpacity>
      {open && <View style={acc.body}>{children}</View>}
    </View>
  );
};

const acc = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, onAdd }) => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [showCategoryPicker, setShowCatPicker] = useState(false);
  const [showPrepPicker, setShowPrepPicker] = useState(false);

  const update = (fields: Partial<FormData>) => setForm(p => ({ ...p, ...fields }));

  // Variant helpers
  const addVariant = () => update({ variants: [...form.variants, { id: uid(), name: '', price: '' }] });
  const updateVariant = (id: string, fields: Partial<Variant>) =>
    update({ variants: form.variants.map(v => v.id === id ? { ...v, ...fields } : v) });
  const deleteVariant = (id: string) =>
    update({ variants: form.variants.filter(v => v.id !== id) });

  // Addon helpers
  const addAddonGroup = () =>
    update({ addonGroups: [...form.addonGroups, { id: uid(), name: '', selectionType: 'multiple', options: [] }] });
  const updateGroup = (gid: string, fields: Partial<AddonGroup>) =>
    update({ addonGroups: form.addonGroups.map(g => g.id === gid ? { ...g, ...fields } : g) });
  const deleteGroup = (gid: string) =>
    update({ addonGroups: form.addonGroups.filter(g => g.id !== gid) });
  const addOption = (gid: string) =>
    update({ addonGroups: form.addonGroups.map(g => g.id === gid ? { ...g, options: [...g.options, { id: uid(), name: '', price: '' }] } : g) });
  const updateOption = (gid: string, oid: string, fields: Partial<AddonOption>) =>
    update({ addonGroups: form.addonGroups.map(g => g.id === gid ? { ...g, options: g.options.map(o => o.id === oid ? { ...o, ...fields } : o) } : g) });
  const deleteOption = (gid: string, oid: string) =>
    update({ addonGroups: form.addonGroups.map(g => g.id === gid ? { ...g, options: g.options.filter(o => o.id !== oid) } : g) });

  const toggleAllergen = (a: string) =>
    update({ allergens: form.allergens.includes(a) ? form.allergens.filter(x => x !== a) : [...form.allergens, a] });
  const toggleTag = (k: string) =>
    update({ tags: form.tags.includes(k) ? form.tags.filter(x => x !== k) : [...form.tags, k] });
  const toggleTimeSlot = (i: number) =>
    update({ timeSlots: form.timeSlots.map((s, idx) => idx === i ? { ...s, active: !s.active } : s) });

  const handlePublish = () => {
    if (!form.name || !form.basePrice) return;
    onAdd({
      ...form,
      id: uid(),
      price: parseFloat(form.basePrice),
      remainingQty: form.quantity,
      orderedToday: 0,
      isSoldOut: false,
    });
    setForm(INITIAL_FORM);
    onClose();
  };

  const canPublish = !!form.name && !!form.basePrice;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={s.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.sheet}
        >

          {/* ── Header ── */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.headerIconBox}>
                <MaterialIcons name="restaurant-menu" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={s.headerTitle}>Add New Item</Text>
                <Text style={s.headerSub}>Create and publish for employees & customers</Text>
              </View>
            </View>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="close" size={19} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
          >

            {/* ══════════════════════════════════════
                SECTION 1 — Basic Information
            ══════════════════════════════════════ */}
            <Accordion title="Basic Information" iconName="info-outline" defaultOpen>
              {/* Photo Upload */}
              <Text style={s.label}>Photo</Text>
              <View style={s.photoRow}>
                <TouchableOpacity style={s.photoBox} activeOpacity={0.75} onPress={() => console.log('Open camera/gallery')}>
                  <MaterialIcons name="add-photo-alternate" size={28} color="#94A3B8" />
                  <Text style={s.photoHint}>Tap to add photo</Text>
                </TouchableOpacity>
              </View>

              {/* Item Name */}
              <Text style={[s.label, { marginTop: 14 }]}>
                Item Name <Text style={s.req}>*</Text>
              </Text>
              <TextInput
                style={s.input}
                value={form.name}
                onChangeText={t => update({ name: t })}
                placeholder="e.g. Veg Biryani"
                placeholderTextColor="#94A3B8"
              />

              {/* Category + Subcategory */}
              <View style={s.row}>
                <View style={s.flex1}>
                  <Text style={s.label}>Category</Text>
                  <TouchableOpacity
                    style={s.select}
                    onPress={() => { setShowCatPicker(p => !p); setShowPrepPicker(false); }}
                    activeOpacity={0.8}
                  >
                    <Text style={s.selectText}>{form.category}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
                  </TouchableOpacity>
                  {showCategoryPicker && (
                    <View style={s.pickerList}>
                      {CATEGORIES.map(c => (
                        <TouchableOpacity
                          key={c}
                          style={s.pickerItem}
                          onPress={() => { update({ category: c }); setShowCatPicker(false); }}
                        >
                          <Text style={[s.pickerItemText, form.category === c && s.pickerItemActive]}>{c}</Text>
                          {form.category === c && <MaterialIcons name="check" size={15} color={COLORS.primary} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={[s.flex1, { marginLeft: 12 }]}>
                  <Text style={s.label}>Subcategory</Text>
                  <TextInput
                    style={s.input}
                    value={form.subcategory}
                    onChangeText={t => update({ subcategory: t })}
                    placeholder="e.g. Rice Bowl"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Food Type Chips */}
              <Text style={s.label}>Food Type</Text>
              <View style={s.chipRow}>
                {FOOD_TYPES.map(ft => (
                  <TouchableOpacity
                    key={ft.key}
                    style={[s.chip, form.foodType === ft.key && s.chipActive]}
                    onPress={() => update({ foodType: ft.key as any })}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.chipText, form.foodType === ft.key && s.chipTextActive]}>
                      {ft.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Base Price */}
              <Text style={s.label}>
                Base Price (₹) <Text style={s.req}>*</Text>
              </Text>
              <TextInput
                style={s.input}
                value={form.basePrice}
                onChangeText={t => update({ basePrice: t })}
                keyboardType="numeric"
                placeholder="120"
                placeholderTextColor="#94A3B8"
              />
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 2 — Pricing & Availability
            ══════════════════════════════════════ */}
            <Accordion title="Pricing & Availability" iconName="local-offer" defaultOpen>
              <View style={s.row}>
                <View style={s.flex1}>
                  <Text style={s.label}>Offer Price (₹)</Text>
                  <TextInput
                    style={s.input}
                    value={form.offerPrice}
                    onChangeText={t => update({ offerPrice: t })}
                    keyboardType="numeric"
                    placeholder="99"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[s.flex1, { marginLeft: 12 }]}>
                  <Text style={s.label}>GST (%)</Text>
                  <TextInput
                    style={s.input}
                    value={form.gst}
                    onChangeText={t => update({ gst: t })}
                    keyboardType="numeric"
                    placeholder="5"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={[s.row, { marginTop: 10 }]}>
                <View style={s.flex1}>
                  <Text style={s.label}>Packaging (₹)</Text>
                  <TextInput
                    style={s.input}
                    value={form.packagingCharge}
                    onChangeText={t => update({ packagingCharge: t })}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[s.flex1, { marginLeft: 12 }]}>
                  <Text style={s.label}>Prep Time</Text>
                  <TouchableOpacity
                    style={s.select}
                    onPress={() => { setShowPrepPicker(p => !p); setShowCatPicker(false); }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="schedule" size={15} color="#64748B" style={{ marginRight: 5 }} />
                    <Text style={[s.selectText, { flex: 1 }]}>{form.prepTime}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
                  </TouchableOpacity>
                  {showPrepPicker && (
                    <View style={s.pickerList}>
                      {PREP_TIMES.map(p => (
                        <TouchableOpacity
                          key={p}
                          style={s.pickerItem}
                          onPress={() => { update({ prepTime: p }); setShowPrepPicker(false); }}
                        >
                          <Text style={[s.pickerItemText, form.prepTime === p && s.pickerItemActive]}>{p}</Text>
                          {form.prepTime === p && <MaterialIcons name="check" size={15} color={COLORS.primary} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Available Toggle */}
              <View style={s.availableTodayRow}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={s.labelNoMargin}>Available Today</Text>
                  <Text style={s.slotSub}>Enable for current orders</Text>
                </View>
                <View style={[s.toggleContainer, { justifyContent: 'flex-end' }]}>
                  <Switch
                    value={form.availableToday}
                    onValueChange={val => update({ availableToday: val })}
                    trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                    thumbColor="#fff"
                    ios_backgroundColor="#E2E8F0"
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                </View>
              </View>
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 3 — Variants
            ══════════════════════════════════════ */}
            <Accordion title="Variants" iconName="layers">
              {form.variants.length === 0 && (
                <Text style={s.emptyNote}>No variants yet. Add sizes, portions, etc.</Text>
              )}
              {form.variants.map(v => (
                <View key={v.id} style={s.miniCard}>
                  <View style={[s.row, { alignItems: 'center' }]}>
                    <TextInput
                      style={[s.miniInput, s.flex1]}
                      value={v.name}
                      onChangeText={t => updateVariant(v.id, { name: t })}
                      placeholder="e.g. Half Plate"
                      placeholderTextColor="#94A3B8"
                    />
                    <View style={[s.miniInput, { width: 90, marginLeft: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0 }]}>
                      <Text style={{ paddingHorizontal: 10, color: '#64748B', fontSize: 13, fontWeight: '600' }}>₹</Text>
                      <TextInput
                        style={{ flex: 1, height: '100%', fontSize: 13, color: '#1E293B' }}
                        value={v.price}
                        onChangeText={t => updateVariant(v.id, { price: t })}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                    <TouchableOpacity
                      style={s.iconBtn}
                      onPress={() => deleteVariant(v.id)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={s.addRowBtn} onPress={addVariant} activeOpacity={0.75}>
                <MaterialIcons name="add-circle-outline" size={17} color={COLORS.primary} />
                <Text style={s.addRowText}>Add Variant</Text>
              </TouchableOpacity>
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 4 — Add-ons & Customizations
            ══════════════════════════════════════ */}
            <Accordion title="Add-ons & Customizations" iconName="tune">
              {form.addonGroups.length === 0 && (
                <Text style={s.emptyNote}>No add-on groups yet. Add extras, spice levels, etc.</Text>
              )}
              {form.addonGroups.map(group => (
                <View key={group.id} style={s.groupCard}>
                  {/* Group Name + Delete */}
                  <View style={[s.row, { alignItems: 'center' }]}>
                    <TextInput
                      style={[s.miniInput, s.flex1]}
                      value={group.name}
                      onChangeText={t => updateGroup(group.id, { name: t })}
                      placeholder="Group name (e.g. Extras)"
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity
                      style={[s.iconBtn, { marginLeft: 8 }]}
                      onPress={() => deleteGroup(group.id)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <MaterialIcons name="delete-outline" size={19} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Selection Type */}
                  <View style={s.selTypeRow}>
                    <TouchableOpacity
                      style={[s.selChip, group.selectionType === 'multiple' && s.selChipActive]}
                      onPress={() => updateGroup(group.id, { selectionType: 'multiple' })}
                    >
                      <MaterialIcons
                        name="check-box"
                        size={14}
                        color={group.selectionType === 'multiple' ? '#fff' : '#64748B'}
                      />
                      <Text style={[s.selChipText, group.selectionType === 'multiple' && s.selChipTextActive]}>
                        Multiple
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.selChip, group.selectionType === 'single' && s.selChipActive]}
                      onPress={() => updateGroup(group.id, { selectionType: 'single' })}
                    >
                      <MaterialIcons
                        name="radio-button-checked"
                        size={14}
                        color={group.selectionType === 'single' ? '#fff' : '#64748B'}
                      />
                      <Text style={[s.selChipText, group.selectionType === 'single' && s.selChipTextActive]}>
                        Single
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Options */}
                  {group.options.map(opt => (
                    <View key={opt.id} style={[s.row, { marginTop: 8, alignItems: 'center' }]}>
                      <TextInput
                        style={[s.miniInput, s.flex1]}
                        value={opt.name}
                        onChangeText={t => updateOption(group.id, opt.id, { name: t })}
                        placeholder="Option name"
                        placeholderTextColor="#94A3B8"
                      />
                      <View style={[s.miniInput, { width: 72, marginLeft: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0 }]}>
                        <Text style={{ paddingHorizontal: 8, color: '#64748B', fontSize: 13, fontWeight: '600' }}>₹</Text>
                        <TextInput
                          style={{ flex: 1, height: '100%', fontSize: 13, color: '#1E293B' }}
                          value={opt.price}
                          onChangeText={t => updateOption(group.id, opt.id, { price: t })}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                      <TouchableOpacity
                        style={[s.iconBtn, { marginLeft: 6 }]}
                        onPress={() => deleteOption(group.id, opt.id)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <MaterialIcons name="close" size={17} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={[s.addRowBtn, { marginTop: 8 }]}
                    onPress={() => addOption(group.id)}
                  >
                    <MaterialIcons name="add" size={16} color={COLORS.primary} />
                    <Text style={s.addRowText}>Add Option</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={s.addRowBtn} onPress={addAddonGroup} activeOpacity={0.75}>
                <MaterialIcons name="add-circle-outline" size={17} color={COLORS.primary} />
                <Text style={s.addRowText}>Add Add-on Group</Text>
              </TouchableOpacity>
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 5 — Description & Nutrition
            ══════════════════════════════════════ */}
            <Accordion title="Description & Nutrition" iconName="description">
              <Text style={s.label}>Description</Text>
              <TextInput
                style={[s.input, s.textArea]}
                value={form.description}
                onChangeText={t => update({ description: t })}
                placeholder="e.g. Traditional veg biryani with aromatic basmati rice and mixed vegetables."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <Text style={[s.label, { marginTop: 14 }]}>Nutrition Info</Text>
              <View style={s.row}>
                {(['calories', 'protein'] as const).map((key, i) => (
                  <View key={key} style={[s.flex1, i > 0 && { marginLeft: 12 }]}>
                    <Text style={s.sublabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                      style={s.input}
                      value={form[key]}
                      onChangeText={t => update({ [key]: t } as any)}
                      placeholder={key === 'calories' ? '450 kcal' : '12g'}
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                ))}
              </View>
              <View style={[s.row, { marginTop: 10 }]}>
                {(['carbs', 'fat'] as const).map((key, i) => (
                  <View key={key} style={[s.flex1, i > 0 && { marginLeft: 12 }]}>
                    <Text style={s.sublabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                      style={s.input}
                      value={form[key]}
                      onChangeText={t => update({ [key]: t } as any)}
                      placeholder={key === 'carbs' ? '55g' : '10g'}
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                ))}
              </View>

              <Text style={[s.label, { marginTop: 14 }]}>Allergens</Text>
              <View style={s.chipRow}>
                {ALLERGENS.map(a => (
                  <TouchableOpacity
                    key={a}
                    style={[s.chip, form.allergens.includes(a) && s.chipActive]}
                    onPress={() => toggleAllergen(a)}
                    activeOpacity={0.75}
                  >
                    {form.allergens.includes(a) && (
                      <MaterialIcons name="check" size={12} color="#fff" style={{ marginRight: 3 }} />
                    )}
                    <Text style={[s.chipText, form.allergens.includes(a) && s.chipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 6 — Smart Tags
            ══════════════════════════════════════ */}
            <Accordion title="Smart Tags" iconName="local-fire-department">
              <View style={s.chipRow}>
                {SMART_TAGS.map(t => (
                  <TouchableOpacity
                    key={t.key}
                    style={[s.chip, form.tags.includes(t.key) && s.chipActive]}
                    onPress={() => toggleTag(t.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.chipText, form.tags.includes(t.key) && s.chipTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 7 — Time Slots
            ══════════════════════════════════════ */}
            <Accordion title="Meal Time Slots" iconName="access-time">
              {form.timeSlots.map((slot, idx) => (
                <View
                  key={slot.label}
                  style={[s.slotRow, idx === form.timeSlots.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <View style={s.slotLeft}>
                    <MaterialIcons
                      name={slot.active ? 'brightness-1' : 'radio-button-unchecked'}
                      size={10}
                      color={slot.active ? COLORS.primary : '#CBD5E1'}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={s.slotLabel}>{slot.label}</Text>
                  </View>
                  <Switch
                    value={slot.active}
                    onValueChange={() => toggleTimeSlot(idx)}
                    trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                    thumbColor="#fff"
                    style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                  />
                </View>
              ))}
            </Accordion>

            {/* ══════════════════════════════════════
                SECTION 8 — Inventory Integration
            ══════════════════════════════════════ */}
            <Accordion title="Inventory Integration" iconName="inventory">
              <View style={s.row}>
                <View style={s.flex1}>
                  <Text style={s.label}>Daily Limit</Text>
                  <TextInput
                    style={s.input}
                    value={form.dailyLimit}
                    onChangeText={t => update({ dailyLimit: t })}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[s.flex1, { marginLeft: 12 }]}>
                  <Text style={s.label}>Low Stock Alert</Text>
                  <TextInput
                    style={s.input}
                    value={form.lowStockAlert}
                    onChangeText={t => update({ lowStockAlert: t })}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={[s.slotRow, { marginTop: 14, borderBottomWidth: 0 }]}>
                <View style={s.slotLeft}>
                  <MaterialIcons name="power-settings-new" size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.slotLabel}>Auto Disable on Sold Out</Text>
                    <Text style={s.slotSub}>Turns off automatically when stock hits 0</Text>
                  </View>
                </View>
                <Switch
                  value={form.autoDisable}
                  onValueChange={val => update({ autoDisable: val })}
                  trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                  thumbColor="#fff"
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                />
              </View>
            </Accordion>

          </ScrollView>

          {/* ── SECTION 9 — Sticky Footer ── */}
          <View style={s.footer}>
            <TouchableOpacity style={s.draftBtn} onPress={() => { }} activeOpacity={0.8}>
              <MaterialIcons name="save-alt" size={16} color="#475569" />
              <Text style={s.draftText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.previewBtn} activeOpacity={0.8}>
              <MaterialIcons name="visibility" size={16} color="#475569" />
              <Text style={s.previewText}>Preview</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.publishBtn, !canPublish && s.publishBtnDisabled]}
              onPress={handlePublish}
              activeOpacity={0.85}
              disabled={!canPublish}
            >
              <MaterialIcons name="rocket-launch" size={16} color="#fff" />
              <Text style={s.publishText}>Publish Item</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '93%',
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  // ── Scroll
  scroll: {
    padding: 14,
    paddingBottom: 8,
  },

  // ── Labels
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
    marginTop: 10,
  },
  labelNoMargin: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  availableTodayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sublabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  req: {
    color: '#EF4444',
  },

  // ── Photo
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  photoBox: {
    width: 100,
    height: 82,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  photoHint: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 4,
  },

  // ── Input
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 76,
    paddingTop: 10,
  },

  // ── Select / Picker
  select: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  pickerList: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  pickerItemText: {
    fontSize: 13,
    color: '#374151',
  },
  pickerItemActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ── Layout
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },

  // ── Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // ── Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  stepBtn: {
    width: 42,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  stepVal: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  // ── Toggle Row
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Variants
  emptyNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 8,
    fontStyle: 'italic',
  },
  miniCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  miniInput: {
    height: 38,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#1E293B',
    backgroundColor: '#fff',
  },
  iconBtn: {
    width: 34,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 5,
    alignSelf: 'flex-start',
  },
  addRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── Addon Groups
  groupCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  selTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  selChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    gap: 5,
  },
  selChipActive: {
    backgroundColor: '#475569',
    borderColor: '#475569',
  },
  selChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  selChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // ── Time Slots
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  slotSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },

  // ── Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EDF2',
    backgroundColor: '#fff',
    gap: 10,
  },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 5,
  },
  draftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 5,
  },
  previewText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    gap: 6,
  },
  publishBtnDisabled: {
    opacity: 0.42,
  },
  publishText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AddItemModal;