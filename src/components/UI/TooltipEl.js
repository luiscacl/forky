import React from 'react';
import classes from './ToolTipEl.module.css';

const TooltipEl = (props) => {
  return (
    <div class={classes.tooltip}>
      {props.children}
      <span class={classes.tooltiptext}>Added</span>
    </div>
  );
};
export default TooltipEl;