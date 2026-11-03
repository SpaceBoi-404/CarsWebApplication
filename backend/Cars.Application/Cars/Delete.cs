using Cars.Infrastructure;
using MediatR;

namespace Cars.Application.Cars
{
    public class Delete
    {
        public class Command : IRequest<bool>
        {
            public required Guid Id { get; set; }
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
                _context.Cars.Remove(existingCar);
                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }
        }
    }
}
