using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using AutoMapper;
using Centromedico.Database.Context;
using Centromedico.Database.DbModels;
using CentromedicoCliente.Exceptions;
using CentromedicoCliente.Profiles;
using CentromedicoCliente.Services;
using CentromedicoCliente.Services.Helpers;
using CentromedicoCliente.Services.Interfaces;
using CentromedicoDoctor.Exceptions;
using CentromedicoDoctor.Hubs;
using CentromedicoDoctor.Profiles;
using CentromedicoDoctor.Services;
using CentromedicoDoctor.Services.Interfaces;
using CentromedicoDoctor.Services.Helpers;
using Cliente.Repository.Repositories;
using Cliente.Repository.Repositories.Interfaces;
using Doctor.Repository.Repositories;
using Doctor.Repository.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Centromedico.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // ---------- JWT ----------
            var secretKey = Configuration["Authorization:LlaveSecreta"];
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("La clave secreta de JWT no está configurada.");
            }

            services.AddHttpContextAccessor();

            // ---------- Client services ----------
            services.AddScoped<CentromedicoCliente.Services.INotificationService, CentromedicoCliente.Services.NotificationService>();
            services.AddScoped<CentromedicoCliente.Services.Helpers.TwilioSettings>();
            services.AddScoped<CentromedicoCliente.Services.IWhatsappService, CentromedicoCliente.Services.WhatsappService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.ICitaService, CentromedicoCliente.Services.CitaService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.IHorarioMedicoService, CentromedicoCliente.Services.HorarioMedicoService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.IAccountService, CentromedicoCliente.Services.AccountService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.ITokenService, CentromedicoCliente.Services.TokenService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.IMedicoService, CentromedicoCliente.Services.MedicoService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.ISeguroService, CentromedicoCliente.Services.SeguroService>();
            services.AddScoped<CentromedicoCliente.Services.Interfaces.IPreguntaService, CentromedicoCliente.Services.PreguntaService>();

            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IAccountRepository, Cliente.Repository.Repositories.AccountRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.ITokenRepository, Cliente.Repository.Repositories.TokenRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.ICitaRepository, Cliente.Repository.Repositories.CitaRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IHorarioMedicoRepository, Cliente.Repository.Repositories.HorarioMedicoRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IPreguntaRepository, Cliente.Repository.Repositories.PreguntaRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IMedicoRepository, Cliente.Repository.Repositories.MedicoRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.ICoberturaRepository, Cliente.Repository.Repositories.CoberturaRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IServicioRepository, Cliente.Repository.Repositories.ServicioRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IHorarioMedicoReservaRepository, Cliente.Repository.Repositories.HorarioMedicoReservaRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.IPacienteRepository, Cliente.Repository.Repositories.PacienteRepository>();
            services.AddScoped<Cliente.Repository.Repositories.Interfaces.ISeguroRepository, Cliente.Repository.Repositories.SeguroRepository>();

            services.Configure<CentromedicoCliente.Services.Helpers.EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.AddScoped<CentromedicoCliente.Services.IEmailService, CentromedicoCliente.Services.EmailService>();

            services.AddSingleton<CentromedicoCliente.Interfaces.Services.IS3Service, CentromedicoCliente.Services.S3Service>();
            services.AddAWSService<IAmazonS3>();

            // ---------- Doctor services ----------
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.ITokenService, CentromedicoDoctor.Services.TokenService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.ICitaService, CentromedicoDoctor.Services.CitaService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IServicioService, CentromedicoDoctor.Services.ServicioService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.ISeguroService, CentromedicoDoctor.Services.SeguroService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IAccountService, CentromedicoDoctor.Services.AccountService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IHorarioMedicoService, CentromedicoDoctor.Services.HorarioMedicoService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IPacienteService, CentromedicoDoctor.Services.PacienteService>();
            services.AddScoped<CentromedicoDoctor.Services.INotificationService, CentromedicoDoctor.Services.NotificationService>();
            services.AddScoped<CentromedicoDoctor.Services.IEmailService, CentromedicoDoctor.Services.EmailService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IGrupoService, CentromedicoDoctor.Services.GrupoService>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IEspecialidadService, CentromedicoDoctor.Services.EspecialidadService>();

            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IPacienteRepository, Doctor.Repository.Repositories.PacienteRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.ISeguroRepository, Doctor.Repository.Repositories.SeguroRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IAccountRepository, Doctor.Repository.Repositories.AccountRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IServicioRepository, Doctor.Repository.Repositories.ServicioRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IMedicoRepository, Doctor.Repository.Repositories.MedicoRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.ITokenRepository, Doctor.Repository.Repositories.TokenRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.ICitaRepository, Doctor.Repository.Repositories.CitaRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IHorarioMedicoRepository, Doctor.Repository.Repositories.HorarioMedicoRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.ICoberturaRepository, Doctor.Repository.Repositories.CoberturaRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IHorarioMedicoReservaRepository, Doctor.Repository.Repositories.HorarioMedicoReservaRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.ISecretariaRepository, Doctor.Repository.Repositories.SecretariaRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IEspecialidadRepository, Doctor.Repository.Repositories.EspecialidadRepository>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.IBalanceRepository, Doctor.Repository.Repositories.BalanceRepository>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.ITurnoService, CentromedicoDoctor.Services.TurnoService>();
            services.AddScoped<Doctor.Repository.Repositories.Interfaces.ITurnoRepository, Doctor.Repository.Repositories.TurnoRepository>();
            services.AddScoped<CentromedicoDoctor.Services.Interfaces.IDatabaseChangeNotificationService, CentromedicoDoctor.Services.SqlDependencyService>();

            services.Configure<CentromedicoDoctor.Services.Helpers.EmailSettings>(Configuration.GetSection("EmailSettings"));

            // ---------- AWS S3 (doctor approach) ----------
            string awsAccessKey = Configuration["AWS:AccessKey"];
            string awsSecretKey = Configuration["AWS:SecretKey"];
            if (!string.IsNullOrEmpty(awsAccessKey) && !string.IsNullOrEmpty(awsSecretKey))
            {
                var awsCredentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
                var s3Client = new AmazonS3Client(awsCredentials, RegionEndpoint.USEast2);
                services.AddSingleton<IAmazonS3>(s3Client);
            }

            // ---------- Twilio ----------
            services.AddScoped<CentromedicoCliente.Services.Helpers.TwilioSettings>();

            // ---------- Controllers / MVC ----------
            services.AddControllersWithViews();
            services.AddMvc(options => options.Filters.Add(typeof(CentromedicoCliente.Exceptions.ExceptionFilter)));
            services.AddMvc().ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    string errors = "";
                    var errorsList = new List<string>();
                    foreach (var state in actionContext.ModelState)
                    {
                        foreach (var error in state.Value.Errors)
                        {
                            errors = error.ErrorMessage;
                            var n = errors.IndexOf("Path");
                            if (n > 0)
                                errorsList.Add(errors.Substring(0, n).Trim());
                            else
                                errorsList.Add(errors);
                        }
                    }
                    var modelState = actionContext.ModelState;
                    return new BadRequestObjectResult(new
                    {
                        error = new[] { errorsList.Count > 0 ? errorsList[0] : "Datos inválidos" },
                    });
                };
            });

            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            // ---------- CORS (allow both frontends) ----------
            services.AddCors(options =>
            {
                options.AddPolicy("EnableCORS", builder =>
                {
                    var allowedOrigins = new string[] { "http://localhost:4211", "http://localhost:4200" };
                    builder.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            services.AddSignalR(opt => opt.EnableDetailedErrors = true);

            // ---------- AutoMapper ----------
            var mapperConfig = new MapperConfiguration(m =>
            {
                m.AddProfile(new CentromedicoCliente.Profiles.MappingProfile());
                m.AddProfile(new CentromedicoDoctor.Profiles.DoctorMappingProfile());
            });
            IMapper mapper = mapperConfig.CreateMapper();
            services.AddAutoMapper(typeof(Startup));

            services.AddScoped<token>();

            // ---------- Identity ----------
            services.AddIdentity<MyIdentityUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 5;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(2);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            }).AddEntityFrameworkStores<MyDbContext>()
              .AddDefaultTokenProviders()
              .AddErrorDescriber<CentromedicoDoctor.Exceptions.SpanishIdentityErrorDescriber>();

            services.AddDbContext<MyDbContext>(option => option.UseSqlServer(
                Configuration.GetConnectionString("DefaultConnection")));

            // ---------- JWT ----------
            services.AddAuthentication(op =>
            {
                op.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                op.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                op.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Authorization:Issuer"],
                    ValidAudience = Configuration["Authorization:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Authorization:LlaveSecreta"])),
                    ClockSkew = TimeSpan.Zero
                };
                o.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/notificacion")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireLoggedIn",
                    policy => policy.RequireRole("Patient", "Client", "Doctor", "Secretary").RequireAuthenticatedUser());
            });

            // ---------- Swagger ----------
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Centro Medico API",
                    Version = "v1",
                    Description = "API unificada del ecosistema Centro Médico (pacientes + administración).",
                });
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath)) c.IncludeXmlComments(xmlPath);
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, CentromedicoDoctor.Services.Interfaces.IDatabaseChangeNotificationService notificationService)
        {
            app.UseDeveloperExceptionPage();
            app.UseCors("EnableCORS");
            app.UseHttpsRedirection();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Centro Medico API"));
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<CentromedicoDoctor.Hubs.NotificationHub>("/notificacion").RequireAuthorization();
            });

            try { notificationService?.Config(); } catch { }
        }
    }
}
