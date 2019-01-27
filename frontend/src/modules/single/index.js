import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PO from './pages/po';
import Branch from './pages/branch';
import FetchDataFromServer from '@/common/components/FetchDataFromServer';

class Single extends React.Component {
    render() {
        return (
            <div className="content">
                <Switch>
                    <Route path="/single/po/:po_number" component={POWrapper}/>
                    <Route path="/single/branch/:branch_id" component={BranchWrapper}/>
                </Switch>
            </div>
        );
    }
}

const POWrapper = (props) => {
    const { po_number } = props.match.params;
    return (
        <FetchDataFromServer 
            url={`/po/single/${po_number}`}
            render={data => <PO data={data}/>}
        />
    )
}

const BranchWrapper = (props) => {
    const { branch_id } = props.match.params;
    return (
        <FetchDataFromServer 
            url={`/branch/single/${branch_id}`}
            render={data => <Branch data={data}/>}
        />
    )
}

export default Single