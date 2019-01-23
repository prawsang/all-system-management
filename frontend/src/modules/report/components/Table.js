import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/common/components/Pagination";

import AllPO from '../tables/AllPO';

class Table extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="panel-content">
                    <div className="is-flex is-jc-space-between">
                        <div className="is-flex is-ai-center">
                            <input className="input" placeholder="Search" />
                            <button className="button has-ml-05 no-mb">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                        <Pagination totalPages={3}/>
                    </div>
                </div>
                <Switch>
                    <Route path="/report/all-po" component={AllPO}/>
                </Switch>
                <div className="panel-content is-flex is-jc-flex-end">
                    <Pagination totalPages={3}/>
                </div>
            </React.Fragment>
        );
    }
}

export default Table;