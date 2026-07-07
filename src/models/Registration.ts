import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { registrationStatusValues } from '@/features/registrations/domain';

const registrationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    callNumber: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true, uppercase: true },
    schoolYear: { type: String, required: true, trim: true },
    nickname: { type: String, required: true, trim: true },
    preferredGame: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    responsibleContact: { type: String, required: true, trim: true },
    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value: boolean) => value === true,
        message: 'Consentimento obrigatório',
      },
    },
    status: {
      type: String,
      enum: registrationStatusValues,
      default: 'pending',
      required: true,
    },
  },
  {
    collection: 'registrations',
    timestamps: true,
  }
);

registrationSchema.index({ className: 1, callNumber: 1 }, { unique: true });

export type RegistrationDocument = InferSchemaType<typeof registrationSchema>;

export const RegistrationModel =
  (mongoose.models.Registration as Model<RegistrationDocument> | undefined) ||
  mongoose.model<RegistrationDocument>('Registration', registrationSchema);
