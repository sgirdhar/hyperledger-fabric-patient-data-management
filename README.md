# Patient Data Management using Hyperledger Fabric

A Hyperledger Fabric prototype as a solution to overcome the problems of traditional records management in hospital/medical system such as accesibility, transfer of records and control of one's own record.

## Fabric Network configuration
### Prerequisite
Follow the instructions given in the link to install necessary tools and to configure the system: https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html

### Bring up the network
Follow the instructions to successfully setup the hospital network.

1. Clone / Download the repository
```bash
$ git clone https://github.com/Shubham-Girdhar/hyperledger-fabric-patient-data-management.git
```
2. **Before starting with the network is set-up start the docker.**

3. Run the following command to install the binaries and images.
```bash
$ curl -sSL https://bit.ly/2ysbOFE | bash -s
```

4. Change the working directory to /fabric-samples/pdm-network
```bash
$ cd ../fabric-samples/pdm-network
```

5. Use the following command to start the network, with 2 organization hospital1 and hospital2 with one peer each (peer0) and an Orderer node.
```bash
$ ./network.sh createChannel -ca -s couchdb
```

7. Deploy the chaincode.
**Note: If default channel name is not used then the following command applies, else remove the channel arguments (-c) and run the command.**
```bash
$ ./network.sh deployCC -ccn custom -ccp ../pdm-custom/chaincode-javascript -ccl javascript
```
This command will deploy a javascript chaincode on mychannel


8. Use this command to bring the network down
```bash
$ ./network.sh down
```

### To setup the SDK
Reguister the admins by excuting the regesisterHospital1Admin.js and regesisterHospital2Admin.js in th sdk directory
```bash
$ cd ..
$ cd sdk
```

```bash
$ node regesisterHospital1Admin.js
$ node regesisterHospital2Admin.js
```

### To setup the SDK
Move to the client directory and execute the client.js
```bash
$ cd ..
$ cd client
```
```bash
$ node client.js
```

### To setup the Angulat Frontend
Change to the directory pdm
```bash
$ cd ..
$ cd pdm
```
Then excute the following commands
```bash
$ ng serve -o
```

## Troubleshooting
Incase if any of the commands fail due to configurations or the network was not brought down properly use the following commands to clear the corrupted docker images and fix the issue.

1. Stop the containers.
```bash
$docker stop $(docker ps -a -q)
```
2. Remove the containers
```bash
$docker rm -f $(docker ps -aq)
```
3. Remove all unused images not just dangling ones
```bash
$docker system prune -a
```

4. Remove all unused local volumes
```bash
$docker volume prune
```
5. Restart the docker.

6. Once the docker is up ,open a new terminal and download the images. (same as Step 3 in Bring up the network section)
``` bash
$ curl -sSL https://bit.ly/2ysbOFE | bash -s
```
