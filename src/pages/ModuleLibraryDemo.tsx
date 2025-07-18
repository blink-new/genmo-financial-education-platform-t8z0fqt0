import React from 'react';
import ModuleLibrary from '@/components/ModuleLibrary';
import { useApp } from '@/hooks/useApp';

export default function ModuleLibraryDemo() {
  // Demo client branding - this would come from the client configuration
  const clientBranding = {
    name: 'GenMo',
    primaryColor: '#2563EB',
    accentColor: '#10B981',
    logo: 'genmo'
  };

  return (
    <ModuleLibrary clientBranding={clientBranding} />
  );
}