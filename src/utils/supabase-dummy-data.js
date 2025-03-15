import { v4 as uuidv4 } from 'uuid';

// First, let's create profiles since they're required by foreign key constraints
const PROFILE_1_ID = '40f46304-13d8-4302-8e83-c29f1917dd65';
const PROFILE_2_ID = '5ba463b3-6df9-419a-b547-784dae5c4f45';
const PRODUCT_1_ID = uuidv4();
const PRODUCT_2_ID = uuidv4();
const ORDER_1_ID = uuidv4();
const ORDER_2_ID = uuidv4();


const dummyAddresses = [
  {
    id: uuidv4(),
    profile_id: PROFILE_1_ID,
    address_line1: '123 Main St',
    address_line2: 'Suite 100',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400001',
    country: 'India',
    is_default: true
  },
  {
    id: uuidv4(),
    profile_id: PROFILE_2_ID,
    address_line1: '456 Market St',
    address_line2: 'Floor 2',
    city: 'Delhi',
    state: 'Delhi',
    postal_code: '110001',
    country: 'India',
    is_default: true
  }
];

const dummyProducts = [
  {
    id: PRODUCT_1_ID,
    seller_id: PROFILE_1_ID,
    name: 'Organic Rice',
    description: 'Premium quality organic rice',
    price: 150.00,
    stock_quantity: 100,
    category: 'Grains',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: PRODUCT_2_ID,
    seller_id: PROFILE_2_ID,
    name: 'Fresh Tomatoes',
    description: 'Farm fresh tomatoes',
    price: 40.00,
    stock_quantity: 50,
    category: 'Vegetables',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

function generateOrderNumber() {
  return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

const dummyOrders = [
  {
    id: ORDER_1_ID,
    order_number: generateOrderNumber(),
    seller_id: PROFILE_1_ID,
    customer_name: 'Customer One',
    customer_email: 'customer1@example.com',
    customer_phone: '+911234567890',
    status: 'completed',
    total_amount: 300.00,
    shipping_address: '123 Customer St, Mumbai, India',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    buyer_name: 'Customer One',
    order_date: new Date().toISOString()
  },
  {
    id: ORDER_2_ID,
    order_number: generateOrderNumber(),
    seller_id: PROFILE_2_ID,
    customer_name: 'Customer Two',
    customer_email: 'customer2@example.com',
    customer_phone: '+911234567891',
    status: 'processing',
    total_amount: 200.00,
    shipping_address: '456 Customer Ave, Delhi, India',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    buyer_name: 'Customer Two',
    order_date: new Date().toISOString()
  }
];

const dummyOrderItems = [
  {
    id: uuidv4(),
    order_id: ORDER_1_ID,
    product_id: PRODUCT_1_ID,
    quantity: 2,
    unit_price: 150.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    order_id: ORDER_2_ID,
    product_id: PRODUCT_2_ID,
    quantity: 5,
    unit_price: 40.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const dummyTodos = [
  {
    id: uuidv4(),
    profile_id: PROFILE_1_ID,
    title: 'Update inventory',
    description: 'Check and update stock levels',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    profile_id: PROFILE_2_ID,
    title: 'Contact supplier',
    description: 'Discuss next shipment details',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const dummySellerTips = [
  {
    id: uuidv4(),
    title: 'Improve Your Product Photos',
    content: 'Use high-quality images with good lighting to showcase your products better.',
    category: 'Marketing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Optimize Your Pricing',
    content: 'Regularly review and adjust your prices based on market trends and competition.',
    category: 'Business',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function insertDummyAddresses(supabase) {
  console.log('Inserting dummy addresses...');
  const { error } = await supabase
    .from('addresses')
    .upsert(dummyAddresses, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting addresses:', error);
  }
}

async function insertDummyProducts(supabase) {
  console.log('Inserting dummy products...');
  const { error } = await supabase
    .from('products')
    .upsert(dummyProducts, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting products:', error);
  }
}

async function insertDummyOrders(supabase) {
  console.log('Inserting dummy orders with auto-generated IDs...');
  
  // Prepare orders without pre-defined IDs
  const ordersToInsert = dummyOrders.map(order => {
    // Create a new object without the id field
    const { id, ...orderWithoutId } = order;
    return orderWithoutId;
  });
  
  // Simple insert and let database generate IDs
  const { data, error } = await supabase
    .from('orders')
    .insert(ordersToInsert)
    .select();
    
  if (error) {
    console.error('Error inserting orders:', error);
  } else {
    console.log(`Successfully inserted ${data.length} orders`);
    return data; // Return inserted orders with their new IDs
  }
}

async function insertDummyOrderItems(supabase) {
  console.log('Inserting dummy order items...');
  const { error } = await supabase
    .from('order_items')
    .upsert(dummyOrderItems, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting order items:', error);
  }
}

async function insertDummyTodos(supabase) {
  console.log('Inserting dummy todos...');
  const { error } = await supabase
    .from('todos')
    .upsert(dummyTodos, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting todos:', error);
  }
}

async function insertDummySellerTips(supabase) {
  console.log('Inserting dummy seller tips...');
  const { error } = await supabase
    .from('seller_tips')
    .upsert(dummySellerTips, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting seller tips:', error);
  }
}

export async function populateDummyData(supabase) {
  try {
    
    // Then create all other data
    await insertDummyAddresses(supabase);
    await insertDummyProducts(supabase);
    await insertDummyOrders(supabase);
    await insertDummyOrderItems(supabase);
    await insertDummyTodos(supabase);
    await insertDummySellerTips(supabase);
    
    console.log('All dummy data insertion processes completed.');
  } catch (error) {
    console.error('Error in populateDummyData:', error);
    throw error;
  }
}
