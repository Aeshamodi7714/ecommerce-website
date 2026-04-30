import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';
import { sampleProducts } from '../../data/sampleProducts';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const url = '/product/all';
    console.log(`🌐 Calling API: ${url}`, params);
    const response = await axiosInstance.get(url, { params });
    const data = response.data;
    
    // The backend returns { message: "...", products: [...] }
    const rawItems = data.products || data.data || (Array.isArray(data) ? data : []);
    
    const mappedItems = rawItems.map(p => ({
      ...p,
      image: p.image || (p.images && p.images.length > 0 ? p.images[0] : null)
    }));
    
    console.log(`✅ Fetched ${mappedItems.length} products from DB`);
    return { products: mappedItems, total: data.total || mappedItems.length };
  } catch (error) {
    console.error('❌ API Error in fetchProducts:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/product/${id}`);
    const data = response.data;
    const raw = data.product || data.data || data;
    // Map images array → image field for frontend compatibility
    const mapped = {
      ...raw,
      image: raw.image || (raw.images && raw.images.length > 0 ? raw.images[0] : null),
    };
    return { ...data, product: mapped };
  } catch (error) {
    // Fallback: search sampleProducts by _id (string match)
    const found = sampleProducts.find(p => p._id === id || p._id === String(id));
    if (found) return { product: found };
    return rejectWithValue('Product not found');
  }
});

export const addProduct = createAsyncThunk('products/add', async (productData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/product/add', productData);
    return response.data.product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/product/${id}`, data);
    return response.data.updatedProduct;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/product/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
    },
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.pagination.total = action.payload.total || state.items.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product || action.payload.data || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
