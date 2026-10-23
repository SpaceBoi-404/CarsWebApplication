using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars
{
    public class Edit
    {
        public class Command : IRequest<bool>
        {
            public required Guid Id { get; set; }
            public required Car Car { get; set; }
        }
        public class Handler : IRequestHandler<Command, bool>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                var existingCar = await _context.Cars.FindAsync([request.Id], cancellationToken);
                if (existingCar is null) return false;

                existingCar.Brand = request.Car.Brand;
                existingCar.Model = request.Car.Model;
                existingCar.DoorsNumber = request.Car.DoorsNumber;
                existingCar.LuggageCapacity = request.Car.LuggageCapacity;
                existingCar.EngineCapacity = request.Car.EngineCapacity;
                existingCar.FuelType = request.Car.FuelType;
                existingCar.ProductionDate = request.Car.ProductionDate;
                existingCar.AverageFuelConsumption = request.Car.AverageFuelConsumption;
                existingCar.BodyType = request.Car.BodyType;

                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }
        }
        public class  CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Car).SetValidator(new CarValidator());
            }
        }
    }
}
