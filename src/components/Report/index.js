import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import { ReportKindT } from '../../entities/Report';
import ExpenseIncome from './Kind/ExpenseIncome';
import NetIncome from './Kind/NetIncome';
import ExpenseTags from './Kind/ExpenseTags';
import NetWorth from './Kind/NetWorth';
import './index.css';
import { signOut } from '../../features/user/state/ui/SignOut.action';
import { getProfileFetch } from '../../redux/actions';
import { isDemoUser, isSignedIn } from '../../features/user/state/User.selector';
import { connect } from 'react-redux';

class Report extends React.Component {
  componentDidMount() {
    this.props.getProfileFetch()
  }

  render() {
    return (
      <div className="ct-octave mt-report">
        {localStorage.getItem("isAdmin") === "true" &&
        (<Loader active={this.props.isLoading} />) &&
          !this.props.isLoading && this.renderReportByKind()
        }

        {
          localStorage.getItem("isAdmin") === "false" &&
          (window.location = '/') &&
          (window.alert("Not allowed because not a premium role!"))
        }

      </div>
    );
  }

  renderReportByKind() {
    switch (this.props.kind) {
      case ReportKindT.ExpenseIncome:
        return <ExpenseIncome {...this.props} />;
      case ReportKindT.NetIncome:
        return <NetIncome {...this.props} />;
      case ReportKindT.NetWorth:
        return <NetWorth {...this.props} />;
      case ReportKindT.ExpenseTags:
        return <ExpenseTags {...this.props} />;
      default:
        return 'Not available';
    }
  }
}

Report.propTypes = {
  isLoading: PropTypes.bool,
  currency: PropTypes.string,
  kind: PropTypes.string,
  data: PropTypes.shape({
    labels: PropTypes.array,
    series: PropTypes.array
  })
};

const mapStateToProps = state => ({
  currentUser: state.userAuth.currentUser
});

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Report);
