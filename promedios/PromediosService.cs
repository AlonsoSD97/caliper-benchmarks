using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Web3;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Contracts.CQS;
using Nethereum.Contracts.ContractHandlers;
using Nethereum.Contracts;
using System.Threading;
using CaliperBenchmarks.Contracts.promedios.ContractDefinition;

namespace CaliperBenchmarks.Contracts.promedios
{
    public partial class PromediosService
    {
        public static Task<TransactionReceipt> DeployContractAndWaitForReceiptAsync(Nethereum.Web3.Web3 web3, PromediosDeployment promediosDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            return web3.Eth.GetContractDeploymentHandler<PromediosDeployment>().SendRequestAndWaitForReceiptAsync(promediosDeployment, cancellationTokenSource);
        }

        public static Task<string> DeployContractAsync(Nethereum.Web3.Web3 web3, PromediosDeployment promediosDeployment)
        {
            return web3.Eth.GetContractDeploymentHandler<PromediosDeployment>().SendRequestAsync(promediosDeployment);
        }

        public static async Task<PromediosService> DeployContractAndGetServiceAsync(Nethereum.Web3.Web3 web3, PromediosDeployment promediosDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            var receipt = await DeployContractAndWaitForReceiptAsync(web3, promediosDeployment, cancellationTokenSource);
            return new PromediosService(web3, receipt.ContractAddress);
        }

        protected Nethereum.Web3.IWeb3 Web3{ get; }

        public ContractHandler ContractHandler { get; }

        public PromediosService(Nethereum.Web3.Web3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public PromediosService(Nethereum.Web3.IWeb3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public Task<string> ActualizarPromedioRequestAsync(ActualizarPromedioFunction actualizarPromedioFunction)
        {
             return ContractHandler.SendRequestAsync(actualizarPromedioFunction);
        }

        public Task<TransactionReceipt> ActualizarPromedioRequestAndWaitForReceiptAsync(ActualizarPromedioFunction actualizarPromedioFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(actualizarPromedioFunction, cancellationToken);
        }

        public Task<string> ActualizarPromedioRequestAsync(BigInteger index, byte[] alumnoJson)
        {
            var actualizarPromedioFunction = new ActualizarPromedioFunction();
                actualizarPromedioFunction.Index = index;
                actualizarPromedioFunction.AlumnoJson = alumnoJson;
            
             return ContractHandler.SendRequestAsync(actualizarPromedioFunction);
        }

        public Task<TransactionReceipt> ActualizarPromedioRequestAndWaitForReceiptAsync(BigInteger index, byte[] alumnoJson, CancellationTokenSource cancellationToken = null)
        {
            var actualizarPromedioFunction = new ActualizarPromedioFunction();
                actualizarPromedioFunction.Index = index;
                actualizarPromedioFunction.AlumnoJson = alumnoJson;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(actualizarPromedioFunction, cancellationToken);
        }

        public Task<string> AddProfesorRequestAsync(AddProfesorFunction addProfesorFunction)
        {
             return ContractHandler.SendRequestAsync(addProfesorFunction);
        }

        public Task<TransactionReceipt> AddProfesorRequestAndWaitForReceiptAsync(AddProfesorFunction addProfesorFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(addProfesorFunction, cancellationToken);
        }

        public Task<string> AddProfesorRequestAsync(string name, BigInteger index)
        {
            var addProfesorFunction = new AddProfesorFunction();
                addProfesorFunction.Name = name;
                addProfesorFunction.Index = index;
            
             return ContractHandler.SendRequestAsync(addProfesorFunction);
        }

        public Task<TransactionReceipt> AddProfesorRequestAndWaitForReceiptAsync(string name, BigInteger index, CancellationTokenSource cancellationToken = null)
        {
            var addProfesorFunction = new AddProfesorFunction();
                addProfesorFunction.Name = name;
                addProfesorFunction.Index = index;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(addProfesorFunction, cancellationToken);
        }

        public Task<AlumnosOutputDTO> AlumnosQueryAsync(AlumnosFunction alumnosFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<AlumnosFunction, AlumnosOutputDTO>(alumnosFunction, blockParameter);
        }

        public Task<AlumnosOutputDTO> AlumnosQueryAsync(BigInteger returnValue1, BlockParameter blockParameter = null)
        {
            var alumnosFunction = new AlumnosFunction();
                alumnosFunction.ReturnValue1 = returnValue1;
            
            return ContractHandler.QueryDeserializingToObjectAsync<AlumnosFunction, AlumnosOutputDTO>(alumnosFunction, blockParameter);
        }

        public Task<ProfesorOutputDTO> ProfesorQueryAsync(ProfesorFunction profesorFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<ProfesorFunction, ProfesorOutputDTO>(profesorFunction, blockParameter);
        }

        public Task<ProfesorOutputDTO> ProfesorQueryAsync(string returnValue1, BigInteger returnValue2, BlockParameter blockParameter = null)
        {
            var profesorFunction = new ProfesorFunction();
                profesorFunction.ReturnValue1 = returnValue1;
                profesorFunction.ReturnValue2 = returnValue2;
            
            return ContractHandler.QueryDeserializingToObjectAsync<ProfesorFunction, ProfesorOutputDTO>(profesorFunction, blockParameter);
        }
    }
}
