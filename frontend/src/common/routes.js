import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Nav from './components/Nav';
import Menu from './components/Menu';
import Report from '../modules/report';
import PORecord from '../modules/porecord';
import Single from '../modules/single';

class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Nav />
                <Menu />
                <div className="container main with-side-bar">
                    <Router history={history}>
                        <Switch>
                            <Route path="/single" component={Single} />
                            <Route path="/po-record" component={PORecord} />
                            <Route path="/report" component={Report} />
                            <Route path="/" component={Home} />
                        </Switch>
                    </Router>
                </div>
            </React.Fragment>
        );
    }
}
export default AppRouter;


const Home = () => (
    <div className="content">
        <p className="is-gray-3">Please select a menu.</p>
    </div>
);