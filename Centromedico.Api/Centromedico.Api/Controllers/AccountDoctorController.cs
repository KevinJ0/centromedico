using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Centromedico.Database.Context;
using Cliente.DTO;
using CentromedicoCliente.Services.Interfaces;
using CentromedicoDoctor.Services.Interfaces;
using Doctor.DTO;
using Doctor.Repository.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Centromedico.Database.DbModels;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace CentromedicoCliente.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    [ApiController]
    public class AccountDoctorController : Controller
    {

        private readonly UserManager<MyIdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<MyIdentityUser> _signManager;
        private readonly IConfiguration _configuration;
        private readonly MyDbContext _db;
        private readonly IMapper _mapper;
        private readonly CentromedicoCliente.Services.Interfaces.IAccountService _accountSvc;          // client
        private readonly CentromedicoDoctor.Services.Interfaces.IAccountService _doctorAccountSvc;
        private readonly IMedicoRepository _medicoRepo;
        private readonly IBalanceRepository _balanceRepo;
        private readonly ISecretariaRepository _secretaryRepo;

        public AccountDoctorController(
            CentromedicoCliente.Services.Interfaces.IAccountService accountSvc,
            CentromedicoDoctor.Services.Interfaces.IAccountService doctorAccountSvc,
            IBalanceRepository balanceRepo,
            ISecretariaRepository secretaryRepo,
            IMedicoRepository medicoRepo,
            RoleManager<IdentityRole> roleManager,
            UserManager<MyIdentityUser> userManager,
            SignInManager<MyIdentityUser> signManager,
            MyDbContext context,
            IConfiguration configuration,
            IMapper mapper)
        {
            _accountSvc = accountSvc;
            _doctorAccountSvc = doctorAccountSvc;
            _medicoRepo = medicoRepo;
            _secretaryRepo = secretaryRepo;
            _balanceRepo = balanceRepo;
            _userManager = userManager;
            _signManager = signManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _db = context;
            _mapper = mapper;
        }

        // ---- renamed (doctor-prefixed) endpoints already used by frontend ----

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor")]
        [HttpPost("[action]")]
        public async Task<ActionResult> setUserInfoDoctorAsync(Cliente.DTO.UserInfo formuser)
        {
            bool result = await _accountSvc.saveUserInfoAsync(formuser);
            if (!result)
                return BadRequest("La fecha de nacimiento no es valida, debe ser mayor de edad");
            else
                return Ok();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor")]
        [HttpGet("[action]")]
        public async Task<ActionResult<Doctor.DTO.medicoDTO>> getUserInfoDoctorAsync()
        {
            try
            {
                string userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                MyIdentityUser user = await _userManager.FindByNameAsync(userName);
                if (user.doc_identidad == null)
                    return NotFound();
                Doctor.DTO.medicoDTO userInfo = await _doctorAccountSvc.getUserInfoAsync(user);
                return userInfo;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor")]
        [HttpGet("[action]")]
        public async Task<bool> isUserDocIdentConfirmDoctorAsync()
        {
            try
            {
                string userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                MyIdentityUser user = await _userManager.FindByNameAsync(userName);
                return user.confirm_doc_identidad ? true : false;
            }
            catch (Exception e)
            {
                throw new Exception("Ha ocurrido un error: " + e.Message);
            }
        }

        // ---- original doctor endpoints (names match frontend calls) ----

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor")]
        [HttpPost("[action]")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> saveUserInfoAsync([FromForm] Doctor.DTO.userMedicoDto formuser)
        {
            try
            {
                bool result = await _doctorAccountSvc.saveUserInfoAsync(formuser);
                if (!result)
                    return BadRequest();
                return Ok();
            }
            catch (Exception e)
            {
                throw new Exception("Ha ocurrido un error al tratar de hacer la solicitud: " + e.Message);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor, Secretary")]
        [HttpPut("[action]")]
        public async Task<ActionResult<bool>> changePasswordAsync(Doctor.DTO.ResetPasswordDTO resetPassDto)
        {
            try
            {
                string userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                MyIdentityUser user = await _userManager.FindByNameAsync(userName);
                if (user.UserName == null)
                    throw new BadHttpRequestException("Este usuario no existe en la base de datos.");
                bool result = await _doctorAccountSvc.changePassword(resetPassDto);
                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor")]
        [HttpGet("[action]")]
        public async Task<ActionResult<List<Centromedico.Database.DbModels.secretariasDTO>>> getAllSecretaryAsync()
        {
            try
            {
                string userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                MyIdentityUser user = await _userManager.FindByNameAsync(userName);
                int medicoId = _medicoRepo.get(user).ID;
                List<Centromedico.Database.DbModels.secretariasDTO> result = _secretaryRepo.getAllByMedicoId(medicoId);
                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor, Secretary")]
        [HttpGet("[action]")]
        public ActionResult<decimal?> getStartingBalance(int? secretariaId, int? medicoId)
        {
            try
            {
                decimal? balance = null;
                if (secretariaId.HasValue || medicoId.HasValue)
                    balance = _balanceRepo.getBySecretariaIdAndMedicoIdAsync(secretariaId, medicoId).Result;
                else
                    throw new ArgumentNullException("No se ha enviado ningun parametro identificador de uno de los usuarios.");
                if (balance == null)
                    throw new BadHttpRequestException("No se ha registrado ningun balance en este dia.");
                return Ok(balance);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Doctor")]
        [HttpPost("[action]")]
        public async Task<ActionResult> setStartingBalanceAsync(Doctor.DTO.balance_cajaDTO balanceDto)
        {
            try
            {
                await _doctorAccountSvc.addOrUpdateBalanceStartingAsync(balanceDto);
                return Ok();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Secretary")]
        [HttpPost("[action]")]
        public async Task<ActionResult> confirmStartingBalanceAsync([FromQuery] int medicoId)
        {
            try
            {
                await _doctorAccountSvc.confirmBalanceStartingAsync(medicoId);
                return Ok();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Secretary")]
        [HttpGet("[action]")]
        public async Task<ActionResult<bool>> isStartingBalanceConfirmedAsync([FromQuery] int medicoId)
        {
            try
            {
                var res = await _doctorAccountSvc.isBalanceStartingConfirmedAsync(medicoId);
                return Ok(res);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
