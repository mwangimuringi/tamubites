import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { MenuItem } from '../../models/MenuItem';
import { isAdmin } from '../auth/[...nextauth]/route';

// Ensure Mongoose connection is established
if (mongoose.connections[0].readyState === 0) {
  mongoose.connect(process.env.MONGO_URL);
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (await isAdmin()) {
      const menuItemDoc = await MenuItem.create(data);
      return NextResponse.json(menuItemDoc);
    } else {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error in POST /api/menu-items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (await isAdmin()) {
      const { _id, ...data } = await req.json();
      const updatedMenuItem = await MenuItem.findByIdAndUpdate(_id, data, { new: true });
      return NextResponse.json(updatedMenuItem);
    } else {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error in PUT /api/menu-items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const menuItems = await MenuItem.find();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error in GET /api/menu-items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    if (await isAdmin()) {
      await MenuItem.deleteOne({ _id });
      return NextResponse.json({ message: 'Deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error in DELETE /api/menu-items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
