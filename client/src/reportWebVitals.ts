import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry: any) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
