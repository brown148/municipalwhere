import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import '../InfoModal.css';

export default function InfoModal({ visible, onClose, fields, insideFeature }) {
  if (!insideFeature) {
    return null;
  }

  const formatValue = (value, isString) => {
    if (isString) {
      return value;
    }
    if (!isNaN(value)) {
      return Number(value).toLocaleString();
    }
    return value;
  };

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="modal-overlay" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-overlay" />
        </Transition.Child>

        <div className="modal-overlay">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-content">
                <Dialog.Title as="h3" className="modal-title">
                  {fields[0] ? fields[0].label : 'Information'}
                </Dialog.Title>
                <div className="table">
                  {fields.map((field, index) => (
                    <div key={index} className="table-row">
                      <span className="table-cell-label">{field.label}:</span>
                      <span className="table-cell-value">
                        {formatValue(insideFeature.properties[field.key], true)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

InfoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  insideFeature: PropTypes.object,
};
