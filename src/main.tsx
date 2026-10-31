import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ToastProvider } from './components/ui/Toast';
import '@fontsource-variable/inter';
import 'app-skins/skins.css';
import './styles/index.css';
import { applyLook, getLook } from './lib/look';

// re-apply a saved Look before the first render (no flash of the default colours)
applyLook(getLook());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);
