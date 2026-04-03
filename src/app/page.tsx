'use client';
import React from 'react';
import MasterControlGrid from '@/components/dashboard/MasterControlGrid';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <MasterControlGrid />
    </motion.div>
  );
}
