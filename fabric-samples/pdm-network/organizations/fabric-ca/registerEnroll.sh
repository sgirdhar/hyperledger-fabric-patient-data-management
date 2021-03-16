hospital1#!/bin/bash

source scriptUtils.sh

function createHospital1() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/hospital1.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/hospital1.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-hospital1 --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital1.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/hospital1.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-hospital1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-hospital1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-hospital1 --id.name hospital1admin --id.secret hospital1adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/hospital1.com/peers
  mkdir -p organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-hospital1 -M ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/msp --csr.hosts peer0.ohospital1.com --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital1.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-hospital1 -M ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls --enrollment.profile tls --csr.hosts peer0.hospital1.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/hospital1.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hospital1.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/hospital1.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hospital1.com/tlsca/tlsca.hospital1.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/hospital1.com/ca
  cp ${PWD}/organizations/peerOrganizations/hospital1.com/peers/peer0.hospital1.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/hospital1.com/ca/ca.hospital1.com-cert.pem

  mkdir -p organizations/peerOrganizations/hospital1.com/users
  mkdir -p organizations/peerOrganizations/hospital1.com/users/User1@hospital1.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-hospital1 -M ${PWD}/organizations/peerOrganizations/hospital1.com/users/User1@hospital1.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital1.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hospital1.com/users/User1@hospital1.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/hospital1.com/users/Admin@hospital1.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://hospital1admin:hospital1adminpw@localhost:7054 --caname ca-hospital1 -M ${PWD}/organizations/peerOrganizations/hospital1.com/users/Admin@hospital1.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/hospital1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital1.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hospital1.com/users/Admin@hospital1.com/msp/config.yaml

}

function createHospital2() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/hospital2.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/hospital2.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin2:adminpw@localhost:8054 --caname ca-hospital2 --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-hospital2.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-hospital2.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-hospital2.pem
    OrganizationalUnitIdentifier: admin2
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-hospital2.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/hospital2.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-hospital2 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-hospital2 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-hospital2 --id.name hospital2admin2 --id.secret hospital2adminpw --id.type admin2 --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/hospital2.com/peers
  mkdir -p organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-hospital2 -M ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/msp --csr.hosts peer0.hospital2.com --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital2.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-hospital2 -M ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls --enrollment.profile tls --csr.hosts peer0.hospital2.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/hospital2.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hospital2.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/hospital2.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hospital2.com/tlsca/tlsca.hospital2.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/hospital2.com/ca
  cp ${PWD}/organizations/peerOrganizations/hospital2.com/peers/peer0.hospital2.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/hospital2.com/ca/ca.hospital2.com-cert.pem

  mkdir -p organizations/peerOrganizations/hospital2.com/users
  mkdir -p organizations/peerOrganizations/hospital2.com/users/User1@hospital2.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-hospital2 -M ${PWD}/organizations/peerOrganizations/hospital2.com/users/User1@hospital2.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital2.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hospital2.com/users/User1@hospital2.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/hospital2.com/users/Admin@hospital2.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://hospital2admin2:hospital2adminpw@localhost:8054 --caname ca-hospital2 -M ${PWD}/organizations/peerOrganizations/hospital2.com/users/Admin@hospital2.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/hospital2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hospital2.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hospital2.com/users/Admin@hospital2.com/msp/config.yaml

}

function createOrderer() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/ordererOrganizations/example.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml

  infoln "Register orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/example.com/orderers
  mkdir -p organizations/ordererOrganizations/example.com/orderers/example.com

  mkdir -p organizations/ordererOrganizations/example.com/orderers/orderer.example.com

  infoln "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml

  infoln "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p organizations/ordererOrganizations/example.com/users
  mkdir -p organizations/ordererOrganizations/example.com/users/Admin@example.com

  infoln "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml

}
