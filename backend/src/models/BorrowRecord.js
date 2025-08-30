import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowedDate: {
    type: Date,
    default: Date.now
  },
  returnedDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);
export default BorrowRecord;