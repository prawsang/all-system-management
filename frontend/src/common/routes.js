import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Menu from './components/Menu';
import Report from '../modules/report';
import PORecord from '../modules/porecord';

class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Nav />
                <Menu />
                <div className="container main with-side-bar">
                    <Router>
                        <Switch>
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