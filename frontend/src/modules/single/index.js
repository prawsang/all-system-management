import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PO from './pages/po';

class Single extends React.Component {
    render() {
        return (
            <div className="content">
                <Switch>
                    <Route path="/single/po/:po_number" component={PO}/>
                </Switch>
            </div>
        );
    }
}

export default Single