import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Menu from './components/Menu';
import Report from '../modules/report';

class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Nav />
                <Menu />
                <div className="container main with-side-bar">
                    <Router>
                        <Switch>
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
        <p>Please select a menu.</p>
    </div>
);