import React from 'react';
import { ASSETS } from '../../../../mme-playground/src/modules/assets/data';

export default function AssetsDashboardWidget({ onNavigate }) {
    const confirmed = ASSETS.filter(a => a.status === 'confirmed').length;
    const pending   = ASSETS.filter(a => a.status === 'pending').length;
    const draft     = ASSETS.filter(a => a.status === 'draft').length;

    return (
        <div className="ast-dw">
            <div className="ast-dw__header">
                <span className="ast-dw__header-title">
                    <span className="ast-dw__header-icon">▣</span>
                    Assets & Equipment
                </span>
                <button className="ast-dw__view-btn" onClick={() => onNavigate && onNavigate('asset-setup')}>
                    [View Full Module]
                </button>
            </div>
            <div className="ast-dw__boxes">
                <div className="ast-dw__box" onClick={() => onNavigate && onNavigate('asset-setup')}>
                    <div className="ast-dw__box-left">
                        <div className="ast-dw__box-title">Total Assets</div>
                        <div className="ast-dw__box-value">{ASSETS.length}</div>
                    </div>
                    <div className="ast-dw__box-status ast-dw__box-status--ok">✓ {confirmed} confirmed</div>
                </div>
                <div className="ast-dw__box" onClick={() => onNavigate && onNavigate('asset-setup')}>
                    <div className="ast-dw__box-left">
                        <div className="ast-dw__box-title">Pending</div>
                        <div className="ast-dw__box-value">{pending}</div>
                    </div>
                    <div className="ast-dw__box-status ast-dw__box-status--warn">△ Needs action</div>
                </div>
                <div className="ast-dw__box" onClick={() => onNavigate && onNavigate('distribution')}>
                    <div className="ast-dw__box-left">
                        <div className="ast-dw__box-title">Draft</div>
                        <div className="ast-dw__box-value">{draft}</div>
                    </div>
                    <div className="ast-dw__box-status ast-dw__box-status--pending">◎ Unconfirmed</div>
                </div>
            </div>
        </div>
    );
}
