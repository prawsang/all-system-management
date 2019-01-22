import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Pagination from './components/Pagination';

class Report extends React.Component {
    render() {
        return (
            <div className="content">
                <h3>สาขาที่ยังไม่ได้ติดตั้ง</h3>
                <div className="panel">
                    <div className="panel-content">
                        <div className="is-flex is-jc-space-between">
                            <div className="is-flex is-ai-center">
                                <input className="input" placeholder="Search" /> 
                                <button className="button is-after no-mb"><FontAwesomeIcon icon={faSearch} /></button>
                            </div>
                            <Pagination />
                        </div>
                    </div>
                    <table className="is-fullwidth is-rounded">
                        <thead>
                            <tr>
                                <td>Head 1</td>
                                <td>Head 2</td>
                                <td>Head 3</td>
                                <td>Head 4</td>
                                <td>Head 5</td>
                                <td>Head 6</td>
                            </tr>
                        </thead>
                        <tbody className="is-hoverable">
                            <tr className="is-hoverable is-clickable">
                                <td>Body 1</td>
                                <td><a href="/">Body 2</a></td>
                                <td>Body 3</td>
                                <td>Body 4</td>
                                <td>Body 5</td>
                                <td>Body 6</td>
                            </tr>
                            <tr className="is-hoverable is-clickable">
                                <td>Body 1</td>
                                <td><a href="/">Body 2</a></td>
                                <td>Body 3</td>
                                <td>Body 4</td>
                                <td>Body 5</td>
                                <td>Body 6</td>
                            </tr>
                            <tr className="is-hoverable is-clickable">
                                <td>Body 1</td>
                                <td><a href="/">Body 2</a></td>
                                <td>Body 3</td>
                                <td>Body 4</td>
                                <td>Body 5</td>
                                <td>Body 6</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="panel-content is-flex is-jc-flex-end">
                        <Pagination/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Report;