// Server test setup
// Increase default timeout for integration tests that may interact with in-memory MongoDB
jest.setTimeout(20000);

// Monkey-patch mongoose.Types.ObjectId to be callable (some tests call mongoose.Types.ObjectId())
try {
	const mongoose = require('mongoose');
	const OriginalObjectId = mongoose.Types.ObjectId;
	if (OriginalObjectId && typeof OriginalObjectId === 'function') {
		// If tests call mongoose.Types.ObjectId(), make it return a new ObjectId
		mongoose.Types.ObjectId = function ObjectIdCallable(val) {
			return new OriginalObjectId(val);
		};
		// keep access to the original class on constructor property
		mongoose.Types.ObjectId.constructor = OriginalObjectId.constructor;
	}
} catch (err) {
	// ignore if mongoose isn't available at setup time
}
