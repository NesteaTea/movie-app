import React from 'react';
import { Alert } from 'antd';

const ErrorIndicator = () => (
  <>
    <Alert
      message="Error"
      description="We are aware of the error and are already fixing it."
      type="error"
      showIcon
    />
  </>
);

export default ErrorIndicator;