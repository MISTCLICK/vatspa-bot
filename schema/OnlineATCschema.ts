import mongoose from 'mongoose';

const atcOnlineListScript = new mongoose.Schema({
  result: { type: Object, required: true },
  permanent: { type: Number, required: true }
});

export default mongoose.model<any>('onlineATCvatsim', atcOnlineListScript);