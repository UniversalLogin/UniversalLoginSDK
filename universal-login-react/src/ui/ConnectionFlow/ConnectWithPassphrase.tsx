import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {CustomInput} from '../commons/CustomInput';
import {InputLabel} from '../commons/InputLabel';
import Spinner from '../commons/Spinner';

interface ConnectWithPassphraseProps {
  name: string;
  walletService: WalletService;
  onRecover: () => void;
}

export const ConnectWithPassphrase = ({onRecover, name, walletService}: ConnectWithPassphraseProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRecoveryClick = async () => {
    setIsLoading(true);
    try {
      await walletService.recover(name, code);
      onRecover();
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  return (
    <div>
      <div className="box-header">
        <h1 className="box-title">Connect with passphrase</h1>
      </div>
      <div className="box-content connect-passphrase-content">
        <div className="connect-passphrase-section">
          <p className="box-text connect-passphrase-text">Write your passphrase to recover the access to your account</p>
          <InputLabel htmlFor="">Backup codes</InputLabel>
          <CustomInput
            id="passphrase-input"
            value={code}
            onChange={event => setCode(event.target.value)}
          />
          {(errorMessage && !isLoading) && <div className="hint">{errorMessage}</div>}
        </div>
        <button onClick={onRecoveryClick} className="button-primary connect-passphrase-btn" disabled={!code || isLoading}>
          {isLoading
            ? <Spinner className="connect-spinner" dotClassName="connect-spinner-dot" />
            : 'Recover'
          }
        </button>
      </div>
    </div>
  );
};