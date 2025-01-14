import React from 'react';
import PropTypes from 'prop-types';
import prettyBytes from '../../util/PrettyBytes';
import { Button, Progress, Message } from 'semantic-ui-react';
import './index.css';

class DataImport extends React.Component {
  handleFileChange = event => this.props.openImportFile(event.target.files[0]);
  handleOpenFile = () => this.fileInput.click();

  render() {
    return (
      <div className="mt-dataImport">

        {this.props.isFileSelected && (
          <React.Fragment>
            <p>
              Selected file:{' '}
              <strong>
                {this.props.filename} ({prettyBytes(this.props.filesize)})
              </strong>
            </p>
            {!this.props.isProcessing && (
              <Button.Group>
                <Button onClick={this.props.discardImportFile}>
                  Discard File
                </Button>
                <Button.Or />
                <Button onClick={this.props.startDataImport} positive>
                  Start Import
                </Button>
              </Button.Group>
            )}
            {this.props.isProcessing && (
              <Progress
                active
                indicating
                autoSuccess
                total={this.props.linesToProcess}
                value={this.props.linesProcessed}
              />
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

DataImport.propTypes = {
  isFileSelected: PropTypes.bool,
  isProcessing: PropTypes.bool,
  filename: PropTypes.string,
  filesize: PropTypes.number,
  linesToProcess: PropTypes.number,
  linesProcessed: PropTypes.number,
  error: PropTypes.string,
  openImportFile: PropTypes.func,
  discardImportFile: PropTypes.func,
  startDataImport: PropTypes.func
};

export default DataImport;
