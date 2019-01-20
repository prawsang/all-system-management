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
                <Router>
                    <Switch>
                        <Route path="/report" component={Report} />
                        <Route path="/" component={Home} />
                    </Switch>
                </Router>
            </React.Fragment>
        );
    }
}
export default AppRouter;


const Home = () => (
    <h2>Home</h2>
);