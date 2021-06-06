import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Popup, Button } from 'semantic-ui-react';
import { signOut } from '../../features/user/state/ui/SignOut.action';
import { isSignedIn, isDemoUser } from '../../features/user/state/User.selector';
import { getProfileFetch } from '../../redux/actions';

class User extends React.Component {
  componentDidMount() {
    this.props.getProfileFetch()
  }

  render() {
    if (this.props.isSignOutComplete) return <Redirect to="/" />;

    return (

      <Popup
        on="click"
        trigger={

          <div>
            <div>
              <p>Username: {this.props.currentUser.username}</p>
              <p>Email: {this.props.currentUser.email}</p>
              <p>Phone number: {this.props.currentUser.phone}</p>
            </div>

          <Button
            content={
              <div>

                {this.signOutButtonLabel()}
              </div>
            }
            icon={this.signOutButtonIcon()}
            labelPosition="right"
          />
          </div>
        }
        header="Are you sure you want to sign out?!"
        content={
          <Button
            content="Confirm"
            negative
            style={{ marginTop: '1em' }}
            floated="right"
            loading={this.props.isSignOutRunning}
            disabled={this.props.isSignOutRunning}
            onClick={this.props.signOut}
          />
        }
      />
    );
  }

  signOutButtonLabel() {
    if (this.props.isDemo) return 'Reset demo';

    return 'Sign out';
  }

  signOutButtonIcon() {
    if (this.props.isDemo) return 'refresh';

    return  'sign out';
  }
}

User.propTypes = {
  isDemo: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  isSignOutRunning: PropTypes.bool,
  isSignOutComplete: PropTypes.bool,
  signOut: PropTypes.func
};

const mapStateToProps = state => ({
  isDemo: isDemoUser(state),
  isAuthenticated: isSignedIn(state),
  isSignOutRunning: state.user.ui.signOut.signOutState === 'REQUEST',
  isSignOutComplete: state.user.ui.signOut.signOutState === 'COMPLETE',
  currentUser: state.userAuth.currentUser
});

const mapDispatchToProps = dispatch => ({
  signOut,
  getProfileFetch: () => dispatch(getProfileFetch())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
