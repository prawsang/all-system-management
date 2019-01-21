import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

class Nav extends React.Component {
    state = {
        showUserMenu: false
    };
    render() {
        const { showUserMenu } = this.state;
        return (
            <nav>
                <div className="container is-flex is-jc-flex-end">
                    <div className="nav-item is-clickable">
                        <p>
                            Prawsang
                            <FontAwesomeIcon className="icon is-after" icon={faAngleDown} />
                        </p>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Nav;