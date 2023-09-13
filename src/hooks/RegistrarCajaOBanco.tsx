import React, { useState } from "react";
import { Default } from "../components/molecules/def-bank";
import { TableRegistrarCajaOBanco } from '../pages/RegisterBank';

export const RegistrarCajaOBanco = ({
  cajaActive,
  setCajaActive,
}: {
  cajaActive: any;
  setCajaActive: any;
}) => {
  const [status, setStatus] = useState(true);

  const cambioTable = () => {
    setStatus(true);
  };

  const Cambio = (props: { ban: any }) => {
    if (props.ban) {
      return <TableRegistrarCajaOBanco/>;
    } else {
      return (
        <Default
          cambioTable={cambioTable}
        />
      );
    }
  };

  return <Cambio ban={status} />;
};
