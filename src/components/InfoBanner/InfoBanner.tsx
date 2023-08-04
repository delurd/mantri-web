import React from 'react';

type Props = {
  data?: any;
};

const InfoBanner = (props: Props) => {
  return (
    <>
      {props.data?.information.includes('sholat') ? (
        <></>
      ) : (
        <div style={{marginTop: '10px'}}>
          <p
            style={{
              // padding: '10px 20px',
              // border: '1px solid #68B3DD',
              borderRadius: '5px',
              fontSize: '14px',
            }}
          >
            {props.data?.information}
          </p>
        </div>
      )}
    </>
  );
};

export default InfoBanner;
