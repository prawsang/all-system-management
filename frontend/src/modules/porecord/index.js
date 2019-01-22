import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

class PORecord extends React.Component {
    render() {
        return (
            <div className="content">
                <h3>บันทึกใบสั่งซื้อ (PO)</h3>
                <div className="panel">
                    <div className="panel-content">
                        <form className="form">
                            <div className="field">
                                <input className="input is-fullwidth" placeholder="PO Number"/>
                            </div>
                            <div className="field">
                                <div className="is-flex">
                                    <input className="input is-flex-fullwidth" placeholder="Customer Name"/>
                                    <button className="button is-after" type="button">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </div>
                                <div className="panel input-menu">
                                    <span className="list-item is-clickable">123</span>
                                    <span className="list-item is-clickable">456</span>
                                    <span className="list-item is-clickable">789</span>
                                </div>
                            </div>
                            <div className="field">
                                <div className="is-flex">
                                    <input className="input is-flex-fullwidth" placeholder="Job Code"/>
                                    <button className="button is-after" type="button">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </div>
                            </div>
                            <div className="field">
                                <div className="is-flex">
                                    <input className="input is-flex-fullwidth" placeholder="Branch Name"/>
                                    <div className="buttons is-after">
                                        <button className="button" type="button">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                        <button className="button" type="button">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <h6>สาขาที่เลือกไว้</h6>
                            <p className="is-gray-3">ยังไม่ได้เลือกสาขา</p>
                            <div className="field">
                                <button className="button">บันทึกใบสั่งซื้อ</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default PORecord;