import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/order/add', orderData);
    console.log("Place order response:", response.data);
    return response.data.order;
  } catch (error) {
    console.error("Place order failed:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.message || 'Failed to place order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/order/all');
    console.log("Fetch orders response:", response.data);
    return response.data.order;
  } catch (error) {
    console.error("Fetch orders failed:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastOrder: null,
    orderAddress: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrderAddress: (state, action) => {
      state.orderAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
        // Add new order to the list so it shows up in "My Orders" immediately
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures: payload might be the array itself or { order: [] }
        const orders = Array.isArray(action.payload) ? action.payload : (action.payload?.orders || action.payload?.order || []);
        state.items = orders;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, setOrderAddress } = orderSlice.actions;
export default orderSlice.reducer;
