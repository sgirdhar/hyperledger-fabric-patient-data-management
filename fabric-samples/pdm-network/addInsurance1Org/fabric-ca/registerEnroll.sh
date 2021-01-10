

function createInsurance1 {

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p ../organizations/peerOrganizations/insurance1.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/../organizations/peerOrganizations/insurance1.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:13054 --caname ca-insurance1 --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-13054-ca-insurance1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-13054-ca-insurance1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-13054-ca-insurance1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-13054-ca-insurance1.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/../organizations/peerOrganizations/insurance1.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-insurance1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-insurance1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-insurance1 --id.name insurance1admin --id.secret insurance1adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

	mkdir -p ../organizations/peerOrganizations/insurance1.com/peers
  mkdir -p ../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:13054 --caname ca-insurance1 -M ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/msp --csr.hosts peer0.insurance1.com --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:13054 --caname ca-insurance1 -M ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls --enrollment.profile tls --csr.hosts peer0.insurance1.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null


  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/ca.crt
  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/signcerts/* ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/server.crt
  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/keystore/* ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/server.key

  mkdir ${PWD}/../organizations/peerOrganizations/insurance1.com/msp/tlscacerts
  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/insurance1.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../organizations/peerOrganizations/insurance1.com/tlsca
  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/insurance1.com/tlsca/tlsca.insurance1.com-cert.pem

  mkdir ${PWD}/../organizations/peerOrganizations/insurance1.com/ca
  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/peers/peer0.insurance1.com/msp/cacerts/* ${PWD}/../organizations/peerOrganizations/insurance1.com/ca/ca.insurance1.com-cert.pem

  mkdir -p ../organizations/peerOrganizations/insurance1.com/users
  mkdir -p ../organizations/peerOrganizations/insurance1.com/users/User1@insurance1.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:13054 --caname ca-insurance1 -M ${PWD}/../organizations/peerOrganizations/insurance1.com/users/User1@insurance1.com/msp --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/insurance1.com/users/User1@insurance1.com/msp/config.yaml

  mkdir -p ../organizations/peerOrganizations/insurance1.com/users/Admin@insurance1.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://insurance1admin:insurance1adminpw@localhost:13054 --caname ca-insurance1 -M ${PWD}/../organizations/peerOrganizations/insurance1.com/users/Admin@insurance1.com/msp --tls.certfiles ${PWD}/fabric-ca/insurance1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/insurance1.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/insurance1.com/users/Admin@insurance1.com/msp/config.yaml

}
