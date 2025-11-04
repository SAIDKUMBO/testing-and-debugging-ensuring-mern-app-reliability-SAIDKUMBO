import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', disabled = false, className = '', onClick, ...rest }) {
  const classes = [
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  function handleClick(e) {
    if (disabled) return;
    if (typeof onClick === 'function') onClick(e);
  }

  return (
    <button className={classes} disabled={disabled} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
