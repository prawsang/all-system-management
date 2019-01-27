import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PO from './pages/po';
import FetchDataFromServer from '@/common/components/FetchDataFromServer';

class Single extends React.Component {
    render() {
        return (
            <div className="content">
                <Switch>
                    <Route path="/single/po/:po_number" component={POWrapper}/>
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
            render={data => <PO data={data} po_number={po_number}/>}
        />
    )
}

export default Single