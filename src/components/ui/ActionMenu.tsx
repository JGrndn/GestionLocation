"use client";

import { useState } from "react";

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  items: ActionMenuItem[];
  /** Libellé accessible du bouton déclencheur. */
  ariaLabel?: string;
};

export function ActionMenu({ items, ariaLabel = "Actions" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="menu-wrap">
      <button
        type="button"
        className="menu-btn"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>
      {open && (
        <>
          {/* Overlay transparent : ferme le menu au clic-extérieur. */}
          <div className="menu-overlay" onClick={() => setOpen(false)} />
          <div className="menu" role="menu">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                role="menuitem"
                className={`menu-item${item.danger ? " danger" : ""}`}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  );
}
