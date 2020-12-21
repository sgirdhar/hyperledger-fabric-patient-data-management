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

3. Download the images to seperate folder using the following command.
```bash 
$ curl -sSL https://bit.ly/2ysbOFE | bash -s
```
This command will download the fabric samples, binaries and images. (But the binaries are already included in the Patient Data Management Repo, we are concerned with the images as this will be stored in docker)

4. Change the working directory to /fabric-pdm/pdm-network
```bash
$ cd ../fabric-pdm/pdm-network
```

5. Use the following command to start the network, with 2 organization hospital1 and hospital2 with one peer each (peer0) and an Orderer node.
```bash
$ ./network.sh up
```
Should display the result in the terminal as follows,
![Alt Text](https://github.com/Shubham-Girdhar/hyperledger-fabric-patient-data-management/blob/main/Screenshots/network%20up.png)

Docker dashboard will show the containers created for those nodes as follows,
![Alt Text](https://github.com/Shubham-Girdhar/hyperledger-fabric-patient-data-management/blob/main/Screenshots/Docker%20container%20for%20nodes.png)

6. To create a channel with specific name use the following command, (remove the arugents to create a default channel called 'mychannel').
**Note: Channel names must be all lower case, less than 250 characters long and match the regular expression [a-z][a-z0-9.-]***
```bash
$ ./network.sh createChannel -c hospitalchannel
```

Results will be as follows,
Docker dashboard will show the containers created for those nodes as follows,
![Alt Text](https://github.com/Shubham-Girdhar/hyperledger-fabric-patient-data-management/blob/main/Screenshots/create%20channel%202.png)

7. Deploy the chaincode.
**Note: If default channel name is note used the the following command applies, else remove the channel arguments (-c) and run the command.**
```bash 
$ network.sh deployCC -c hospitalchannel -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
```
This command will deploy a javascript chaincode on hospitalchannel

Result:
![Alt Text](https://github.com/Shubham-Girdhar/hyperledger-fabric-patient-data-management/blob/main/Screenshots/create%20channel%201.png)
![Alt Text](https://github.com/Shubham-Girdhar/hyperledger-fabric-patient-data-management/blob/main/Screenshots/Docker%20container%20with%20chaincode.png)

8. Use this command to bring the network down
```bash
$ ./network.sh down
```

## Troubleshooting
Incase if any of the commands failed due to configurations or the network was not brought down properly use the following commands to clear the corrupted docker images and fix the issue.

1. ```bash $docker stop $(docker ps -a -q) ```
2. ```bash $docker rm -f $(docker ps -aq) ```
3. ```bash $docker system prune -a ```
4. ```bash $docker volume prune ```
5. Restart the docker.
6. Once the docker is up ,open a new terminal and download the images (where the fabric samples are initally downloaded).
``` bash $ curl -sSL https://bit.ly/2ysbOFE | bash -s ```



