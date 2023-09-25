import React from 'react';
import style from './Recovery.module.css';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

export const Recovery = () => {
  return (
    <Box>
      <div>
        <div className={`${style.Login} u-size100-p u-textCenter`}>
          <figure
            className={`${style.LoginBarra} icon-barraHome u-positionAbsolute`}
          ></figure>
          <div className={`${style.LoginCenter} u-inline-block`}>
            <h1 className={`${style.LoginLogo} u-inline-block`}>
              <span className="icon-logo">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
              </span>
            </h1>
            <p>Lorem ipsum dolor sit amet consectetur. Nisl enim</p>

            <Box className={style.boxInput}>
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                size="small"
                color="success"
                classes={{
                  root: style.inputCss,
                }}
              />

              <Link
                to="/"
                className={style.btnBack}
              >
                Regresar
              </Link>

              <Button
                variant="contained"
                size="small"
                classes={{
                  root: style.btnCss,
                }}
              >
                Enviar para recuperar contraseña
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}