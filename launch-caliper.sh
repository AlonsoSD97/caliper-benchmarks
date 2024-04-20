#!/bin/bash

# Set the number of times to run the command

n=$1
output_dir=$2

# install sut
npx caliper bind --caliper-bind-sut besu:latest
# Loop through the desired number of times
for ((i=1; i<=$n; i++))
do
    # Run the hyperledger caliper command
    npx caliper launch manager \
    --caliper-benchconfig /home/salasalonso/caliper-benchmarks/benchmarks/scenario/paciente/config.yaml \
    --caliper-networkconfig //home/salasalonso/caliper-benchmarks/networks/besu_external/1node-clique/networkconfig.json\
    > output.txt 2>&1

    # Export the HTM4L document with the name sample-n
    mkdir -p "$output_dir"
    cp report.html "$output_dir/report-$i.html"
    cp output.txt "$output_dir/sample-$i.txt"
done